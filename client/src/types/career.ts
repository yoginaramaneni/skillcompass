export interface CareerRole {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
}

export interface CareerRoleSkillRequirement {
  skillId: string;
  skillName: string;
  slug: string;
  category?: string | null;
  importance: 'low' | 'medium' | 'high' | 'critical';
  minimumLevel: string;
  minimumLevelNumber: number;
}

export interface CareerRoleDetail extends CareerRole {
  skills: CareerRoleSkillRequirement[];
}
