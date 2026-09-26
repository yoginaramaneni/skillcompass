export const SKILL_LEVELS = {
  BEGINNER: 1,
  ELEMENTARY: 2,
  INTERMEDIATE: 3,
  ADVANCED: 4,
  EXPERT: 5,
} as const;

export const levelToNumber = (level?: string | null): number => {
  switch (level?.toLowerCase()) {
    case 'beginner': return 1;
    case 'elementary': return 2;
    case 'intermediate': return 3;
    case 'advanced': return 4;
    case 'expert': return 5;
    default: return 1;
  }
};

export const numberToLevel = (num: number): string => {
  switch (num) {
    case 1: return 'beginner';
    case 2: return 'elementary';
    case 3: return 'intermediate';
    case 4: return 'advanced';
    case 5: return 'expert';
    default: return 'beginner';
  }
};
