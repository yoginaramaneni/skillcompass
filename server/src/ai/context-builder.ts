import { userRepository } from '../repositories/user.repository';
import { profileRepository } from '../repositories/profile.repository';
import { skillsRepository, STATIC_SKILLS_REFERENCE } from '../repositories/skill.repository';
import { careersRepository, STATIC_CAREERS_REFERENCE } from '../repositories/career.repository';
import { marketService } from '../services/market/market.service';
import { skillNormalizer } from '../services/market/skill-normalizer';
import { levelToNumber } from '../utils/skillLevel';
import { ContextData } from './prompts/skill-intelligence.prompt';

export const buildSkillIntelligenceContext = async (userId: string): Promise<ContextData> => {
  const user = await userRepository.findById(userId);
  const profile = await profileRepository.findByUserId(userId);
  const userSkills = await skillsRepository.getUserSkills(userId);

  // Target Career Role Identification
  const targetCareerId = profile?.target_career_id || 'role-fsd';
  const targetRole = (await careersRepository.findRoleById(targetCareerId)) || STATIC_CAREERS_REFERENCE[0];
  const requiredRoleSkills = await careersRepository.findRoleSkills(targetRole.id);

  // Map user demonstrated skills with details
  const demonstratedSkills = await Promise.all(
    userSkills.map(async (us) => {
      const dbSkill = await skillsRepository.findSkillById(us.skill_id);
      const skillName = dbSkill ? dbSkill.name : us.skill_id;
      const numLevel = levelToNumber(us.self_reported_level);
      const verifiedNum = us.verified_level ? levelToNumber(us.verified_level) : undefined;
      return {
        skillName,
        level: us.self_reported_level || 'beginner',
        numericLevel: numLevel,
        verifiedLevel: us.verified_level || undefined,
        numericVerifiedLevel: verifiedNum,
        yearsExperience: us.years_experience || 0,
      };
    })
  );

  // Map target role benchmark skills
  const requiredSkills = requiredRoleSkills.map((rs) => ({
    skillName: rs.skillName,
    category: rs.category || 'General',
    importance: rs.importance,
    requiredLevel: rs.minimumLevel,
    numericRequiredLevel: rs.minimumLevelNumber,
  }));

  // Deterministic Gap Calculation with Canonical Normalization
  let totalWeightedMatch = 0;
  let totalWeight = 0;

  const deterministicGaps = requiredSkills.map((req) => {
    const reqSlug = skillNormalizer.normalizeToSlug(req.skillName);
    const userMatch = demonstratedSkills.find(
      (ds) => skillNormalizer.normalizeToSlug(ds.skillName) === reqSlug
    );
    const currentLevel = userMatch ? (userMatch.numericVerifiedLevel ?? userMatch.numericLevel) : 0;
    const gap = Math.max(0, req.numericRequiredLevel - currentLevel);

    const weightMap: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    const weight = weightMap[req.importance] || 2;
    const matchRatio = Math.min(1, currentLevel / (req.numericRequiredLevel || 1));

    totalWeightedMatch += matchRatio * weight;
    totalWeight += weight;

    return {
      skillName: req.skillName,
      currentLevel,
      requiredLevel: req.numericRequiredLevel,
      gap,
      importance: req.importance,
    };
  });

  const calculatedReadiness = totalWeight > 0 ? Math.round((totalWeightedMatch / totalWeight) * 100) : 0;

  // Market Signals Integration
  const allMarketSignals = marketService.getAllSkillSignals();
  const marketSignals = requiredSkills.map((req) => {
    const reqSlug = skillNormalizer.normalizeToSlug(req.skillName);
    const ms = allMarketSignals.find((s) => s.slug === reqSlug || s.skillName.toLowerCase() === req.skillName.toLowerCase());
    return {
      skillName: req.skillName,
      mentionRate: ms ? ms.mentionRate : 0,
      trendDirection: ms ? ms.trendDirection : 'insufficient_data',
      source: ms ? ms.source : 'SkillCompass Reference Dataset (Imported)',
      period: ms ? ms.timePeriod : '2026-Q3',
    };
  });

  return {
    user: {
      fullName: user ? `${user.first_name} ${user.last_name}` : 'SkillCompass User',
      currentTitle: profile?.headline || 'Technology Professional',
      experienceLevel: profile?.education_level || 'General',
      targetCareerRole: targetRole.name,
      bio: profile?.bio || undefined,
    },
    targetRole: {
      id: targetRole.id,
      title: targetRole.name,
      description: targetRole.description || '',
      category: targetRole.category || 'Technology',
      experienceLevel: profile?.education_level || 'Mid Level',
    },
    demonstratedSkills,
    requiredSkills,
    deterministicGaps,
    calculatedReadiness,
    marketSignals,
  };
};
