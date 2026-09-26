export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
}

export type SkillLevelString = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'expert';
