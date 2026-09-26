export interface SkillGap {
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
  explanation: string;
}

export interface SkillRecommendation {
  skillName: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  currentLevel: number;
  targetLevel: number;
  skillGap: number;
}

export interface EmergingSkill {
  skillName: string;
  category: string;
  relevance: string;
  reason: string;
}

export interface SkillIntelligenceResponse {
  summary: string;
  careerReadiness: number;
  skillGaps: SkillGap[];
  recommendedSkills: SkillRecommendation[];
  emergingSkills: EmergingSkill[];
  nextSteps: string[];
  createdAt?: string;
}
