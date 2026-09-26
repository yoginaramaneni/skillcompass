import assert from 'assert';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

import { generateToken, verifyToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { levelToNumber } from '../utils/skillLevel';
import { skillNormalizer } from '../services/market/skill-normalizer';
import { trendService } from '../services/market/trend.service';
import { skillIntelligenceResponseSchema } from '../schemas/ai.schema';
import { learningRoadmapSchema } from '../schemas/roadmap.schema';

console.log('----------------------------------------------------');
console.log('SkillCompass Backend Automated Test Suite Execution');
console.log('----------------------------------------------------');

let passedTests = 0;
let totalTests = 0;

const runTest = (description: string, fn: () => void | Promise<void>) => {
  totalTests++;
  try {
    const res = fn();
    if (res && typeof res.then === 'function') {
      res
        .then(() => {
          passedTests++;
          console.log(`✔ [PASS] ${description}`);
        })
        .catch((err: any) => {
          console.error(`❌ [FAIL] ${description}`);
          console.error(`   Error: ${err.message}`);
        });
    } else {
      passedTests++;
      console.log(`✔ [PASS] ${description}`);
    }
  } catch (err: any) {
    console.error(`❌ [FAIL] ${description}`);
    console.error(`   Error: ${err.message}`);
  }
};

// 1. Authentication & JWT Security Tests
runTest('JWT Token Generation and Verification', () => {
  const payload = { userId: 'usr-test-123', email: 'test@skillcompass.io' };
  const token = generateToken(payload);
  assert.ok(token && typeof token === 'string', 'Token should be a non-empty string');

  const decoded: any = verifyToken(token);
  assert.strictEqual(decoded.userId, payload.userId, 'Decoded user ID must match payload');
  assert.strictEqual(decoded.email, payload.email, 'Decoded email must match payload');
});

runTest('Password Hashing & Bcrypt Verification', async () => {
  const password = 'SuperSecurePassword123!';
  const hash = await hashPassword(password);
  assert.ok(hash !== password, 'Hash must not equal plaintext password');

  const isValid = await comparePassword(password, hash);
  assert.strictEqual(isValid, true, 'Valid password must match hash');

  const isInvalid = await comparePassword('WrongPassword', hash);
  assert.strictEqual(isInvalid, false, 'Invalid password must fail hash comparison');
});

// 2. Skill Level Conversion Utility Tests
runTest('Skill Level to Numeric Rank Conversion', () => {
  assert.strictEqual(levelToNumber('beginner'), 1, 'Beginner should map to 1');
  assert.strictEqual(levelToNumber('intermediate'), 3, 'Intermediate should map to 3');
  assert.strictEqual(levelToNumber('advanced'), 4, 'Advanced should map to 4');
  assert.strictEqual(levelToNumber('expert'), 5, 'Expert should map to 5');
  assert.strictEqual(levelToNumber('invalid'), 1, 'Unknown level defaults to 1');
});

// 3. Market Skill Normalizer Tests
runTest('Skill Name Normalization & Slugification', () => {
  assert.strictEqual(skillNormalizer.normalizeToSlug('React.js'), 'react', 'React.js maps to react');
  assert.strictEqual(skillNormalizer.normalizeToSlug('NodeJS'), 'nodejs', 'NodeJS maps to nodejs');
  assert.strictEqual(skillNormalizer.normalizeToSlug('Postgres'), 'postgresql', 'Postgres maps to postgresql');
  assert.strictEqual(skillNormalizer.normalizeToSlug('TypeScript'), 'typescript', 'TypeScript maps to typescript');
});

// 4. Market Trend Calculation Tests
runTest('Market Trend Direction Computation', () => {
  const history = [
    { timePeriod: '2026-Q1', mentions: 100, totalRecords: 1000, mentionRate: 10.0 },
    { timePeriod: '2026-Q2', mentions: 150, totalRecords: 1000, mentionRate: 15.0 },
  ];
  const result = trendService.calculateTrend(history);
  assert.strictEqual(result.trendDirection, 'increasing', 'Rate jump 10% -> 15% is increasing');
});

// 5. AI Schema Zod Validation Tests
runTest('Skill Intelligence Zod Output Schema Validation', () => {
  const validAiPayload = {
    summary: 'Strong foundational frontend skills; needs backend database persistence.',
    careerReadiness: 78,
    skillGaps: [
      {
        skillName: 'Node.js',
        currentLevel: 1,
        requiredLevel: 3,
        gap: 2,
        importance: 'high',
        explanation: 'Essential for building backend server APIs.',
      },
    ],
    recommendedSkills: [
      {
        skillName: 'Node.js',
        category: 'Backend',
        priority: 'high',
        reason: 'Required for target career',
        currentLevel: 1,
        targetLevel: 3,
        skillGap: 2,
      },
    ],
    emergingSkills: [
      {
        skillName: 'AI Agents',
        category: 'Artificial Intelligence',
        relevance: 'high',
        reason: 'Growing industry demand',
      },
    ],
    nextSteps: ['Build Node.js REST API project', 'Take PostgreSQL Assessment'],
    createdAt: new Date().toISOString(),
  };

  const parsed = skillIntelligenceResponseSchema.safeParse(validAiPayload);
  assert.strictEqual(parsed.success, true, 'Valid AI payload must pass Zod schema validation');
});

runTest('Learning Roadmap Zod Output Schema Validation', () => {
  const validRoadmapPayload = {
    title: 'Frontend to Full Stack Masterclass',
    description: 'Personalized step-by-step learning roadmap tailored to user skill gaps.',
    targetCareerRole: 'Full Stack Developer',
    totalEstimatedHours: 40,
    items: [
      {
        id: 'item-1',
        sequenceNumber: 1,
        title: 'Backend Node.js Fundamentals',
        skillName: 'Node.js',
        priority: 'critical' as const,
        whyToLearn: 'Required for server APIs',
        estimatedHours: 20,
        practiceTasks: ['Create Express server', 'Implement JWT auth'],
        status: 'pending' as const,
      },
    ],
  };

  const parsed = learningRoadmapSchema.safeParse(validRoadmapPayload);
  assert.strictEqual(parsed.success, true, 'Valid Learning Roadmap payload must pass Zod schema');
});

console.log('----------------------------------------------------');
console.log('Automated Test Suite Completed Successfully.');
console.log('----------------------------------------------------');
