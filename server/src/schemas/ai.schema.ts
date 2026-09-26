import { z } from 'zod';

export const skillGapSchema = z.object({
  skillName: z.string(),
  currentLevel: z.number().min(0).max(5),
  requiredLevel: z.number().min(1).max(5),
  gap: z.number().min(0).max(5),
  importance: z.enum(['critical', 'high', 'medium', 'low']),
  explanation: z.string(),
});

export const skillRecommendationSchema = z.object({
  skillName: z.string(),
  category: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  reason: z.string(),
  currentLevel: z.number().min(0).max(5),
  targetLevel: z.number().min(1).max(5),
  skillGap: z.number().min(0).max(5),
});

export const emergingSkillSchema = z.object({
  skillName: z.string(),
  category: z.string(),
  relevance: z.string(),
  reason: z.string(),
});

export const marketRelevantSkillSchema = z.object({
  skillName: z.string(),
  reason: z.string(),
  marketSignalSummary: z.string(),
  confidence: z.enum(['supported', 'limited', 'insufficient_data']),
});

export const skillIntelligenceResponseSchema = z.object({
  summary: z.string(),
  careerReadiness: z.number().min(0).max(100),
  skillGaps: z.array(skillGapSchema),
  recommendedSkills: z.array(skillRecommendationSchema),
  emergingSkills: z.array(emergingSkillSchema),
  marketRelevantSkills: z.array(marketRelevantSkillSchema).optional(),
  nextSteps: z.array(z.string()),
  createdAt: z.string().optional(),
});

export type SkillGap = z.infer<typeof skillGapSchema>;
export type SkillRecommendation = z.infer<typeof skillRecommendationSchema>;
export type EmergingSkill = z.infer<typeof emergingSkillSchema>;
export type MarketRelevantSkill = z.infer<typeof marketRelevantSkillSchema>;
export type SkillIntelligenceResponse = z.infer<typeof skillIntelligenceResponseSchema>;
