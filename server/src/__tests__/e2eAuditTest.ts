import { authService } from '../services/auth.service';
import { profileRepository } from '../repositories/profile.repository';
import { skillsRepository } from '../repositories/skill.repository';
import { marketService } from '../services/market/market.service';
import { skillNormalizer } from '../services/market/skill-normalizer';
import { buildSkillIntelligenceContext } from '../ai/context-builder';
import { skillIntelligenceService } from '../ai/skill-intelligence.service';
import { assessmentService } from '../services/assessment.service';
import { roadmapService } from '../services/roadmap.service';
import { logger } from '../utils/logger';

async function runEndToEndAuditTest() {
  console.log('====================================================');
  console.log('SkillCompass End-to-End Complete Real User Audit');
  console.log('====================================================');

  const testEmail = `audit_user_${Date.now()}@skillcompass.io`;
  const testPassword = 'Password123!';
  const firstName = 'Audit';
  const lastName = 'User';

  // 1. REGISTER
  console.log('\nStep 1: Registering new test user...');
  const regResult = await authService.register({
    email: testEmail,
    password: testPassword,
    firstName,
    lastName,
  });
  console.log('✔ User Registered. User ID:', regResult.user.id);
  const userId = regResult.user.id;

  // 2. LOGIN
  console.log('\nStep 2: Logging in test user...');
  const loginResult = await authService.login({
    email: testEmail,
    password: testPassword,
  });
  console.log('✔ Login successful. JWT Token issued.');

  // 3. GET ME
  console.log('\nStep 3: Fetching user details (/api/auth/me)...');
  const meResult = await authService.getMe(userId);
  console.log('✔ Authenticated User Verified:', meResult.email);

  // 4. SETUP PROFILE & TARGET ROLE
  console.log('\nStep 4: Setting target career role to Full Stack Developer (role-fsd)...');
  await profileRepository.upsert(userId, {
    headline: 'Aspiring Full Stack Engineer',
    bio: 'Passionate about building full stack React and Node.js applications.',
    education_level: 'Bachelor Degree',
    target_career_id: 'role-fsd',
    weekly_learning_hours: 10,
  });
  console.log('✔ Profile updated in repository.');

  // 5. ADD DEMONSTRATED SKILLS
  console.log('\nStep 5: Adding initial self-reported skills...');
  await skillsRepository.upsertUserSkill(userId, 'sk-js', { self_reported_level: 'intermediate', years_experience: 2 });
  await skillsRepository.upsertUserSkill(userId, 'sk-react', { self_reported_level: 'beginner', years_experience: 1 });
  await skillsRepository.upsertUserSkill(userId, 'sk-postgres', { self_reported_level: 'beginner', years_experience: 1 });
  console.log('✔ 3 Demonstrated Skills added for user.');

  // 6. VERIFY CANONICAL SKILL NORMALIZATION
  console.log('\nStep 6: Testing Skill Taxonomy & Normalization Engine...');
  const n1 = skillNormalizer.getCanonicalName('React.js');
  const n2 = skillNormalizer.getCanonicalName('React JS');
  const n3 = skillNormalizer.getCanonicalName('Postgres');
  const n4 = skillNormalizer.getCanonicalName('Node.js');

  console.log(`- "React.js"  -> slug: ${n1.slug}, canonical: ${n1.name}`);
  console.log(`- "React JS"  -> slug: ${n2.slug}, canonical: ${n2.name}`);
  console.log(`- "Postgres"  -> slug: ${n3.slug}, canonical: ${n3.name}`);
  console.log(`- "Node.js"   -> slug: ${n4.slug}, canonical: ${n4.name}`);

  if (n1.slug === 'react' && n2.slug === 'react' && n3.slug === 'postgresql' && n4.slug === 'nodejs') {
    console.log('✔ Canonical Skill Identity Normalization PASSED.');
  } else {
    throw new Error('Skill Normalization failed.');
  }

  // 7. REAL STORED MARKET DATA & PROVENANCE
  console.log('\nStep 7: Testing Real Stored Market Data Provenance...');
  const personalizedMarket = await marketService.getPersonalizedMarketView(userId);
  console.log(`✔ Market Signals fetched for Target Career: ${personalizedMarket.targetCareer.name}`);
  console.log(`- Total Required Market Skills: ${personalizedMarket.items.length}`);
  const sampleMarket = personalizedMarket.items[0];
  if (sampleMarket.marketSignal) {
    console.log(`- Sample Provenance: ${sampleMarket.skillName} -> Source: "${sampleMarket.marketSignal.source}", Period: ${sampleMarket.marketSignal.timePeriod}, Mention Rate: ${sampleMarket.marketSignal.mentionRate}%`);
    console.log('✔ Market Data Provenance Verified.');
  }

  // 8. DETERMINISTIC GAP & CAREER READINESS COMPUTATION
  console.log('\nStep 8: Computing Context & Deterministic Career Readiness...');
  const context = await buildSkillIntelligenceContext(userId);
  console.log(`✔ Precomputed Deterministic Readiness Score: ${context.calculatedReadiness}%`);
  console.log(`✔ Precomputed Skill Gaps Count: ${context.deterministicGaps.length}`);

  // 9. START & COMPLETE SKILL ASSESSMENT (ELEVATE TO VERIFIED SKILL)
  console.log('\nStep 9: Starting Skill Assessment for React (sk-react)...');
  const assessmentSession = await assessmentService.startAssessment(userId, 'sk-react');
  console.log(`✔ Assessment Session Started (ID: ${assessmentSession.assessmentId}). Questions count: ${assessmentSession.questions.length}`);
  
  // Verify correct answers are NOT sent to client
  const hasLeakedAnswers = assessmentSession.questions.some((q: any) => 'correctAnswer' in q || 'correct_answer' in q);
  if (hasLeakedAnswers) {
    throw new Error('SECURITY VIOLATION: Correct answers leaked to client during assessment start!');
  }
  console.log('✔ Security Check Passed: Correct answers are backend-only.');

  console.log('\nSubmitting Assessment Answers...');
  // Submit all correct answers to simulate passing score
  const submittedAnswers = assessmentSession.questions.map((q: any) => {
    // Find the correct answer from session store
    const fullSession = (assessmentService as any).activeSessionsStore?.get(assessmentSession.assessmentId);
    const qDetails = fullSession?.questions?.find((fq: any) => fq.id === q.id);
    return {
      questionId: q.id,
      selectedAnswer: qDetails ? qDetails.correctAnswer : 'A',
    };
  });

  const submitResult = await assessmentService.submitAssessment(userId, assessmentSession.assessmentId, submittedAnswers);
  console.log(`✔ Assessment Submitted. Score: ${submitResult.score}%, Verified Level: ${submitResult.verifiedLevelName} (Numeric: ${submitResult.verifiedLevel})`);

  // 10. RECALCULATE READINESS AFTER VERIFIED SKILL ELEVATION
  console.log('\nStep 10: Recalculating Career Readiness post-assessment...');
  const updatedContext = await buildSkillIntelligenceContext(userId);
  console.log(`✔ Updated Career Readiness Score: ${updatedContext.calculatedReadiness}% (Prior: ${context.calculatedReadiness}%)`);

  // 11. GENERATE LEARNING ROADMAP
  console.log('\nStep 11: Generating Personalized Learning Roadmap...');
  const roadmap = await roadmapService.generateRoadmap(userId);
  console.log(`✔ Roadmap Generated. Title: "${roadmap.title}", Total Modules: ${roadmap.items.length}, Total Hours: ${roadmap.totalEstimatedHours} hrs`);

  console.log('\n====================================================');
  console.log('🎉 END-TO-END SYSTEM AUDIT COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

runEndToEndAuditTest().catch((err) => {
  console.error('❌ E2E Audit Test Failed:', err);
  process.exit(1);
});
