export type TrendDirection = 'increasing' | 'stable' | 'decreasing' | 'insufficient_data';
export type FreshnessStatus = 'fresh' | 'aging' | 'stale';

export interface MarketHistoryPoint {
  timePeriod: string;
  mentions: number;
  totalRecords: number;
  mentionRate: number;
}

export interface MarketSkillSignal {
  skillId: string;
  skillName: string;
  slug: string;
  category: string;
  mentions: number;
  totalRecords: number;
  mentionRate: number;
  trendDirection: TrendDirection;
  absoluteChange?: number;
  relativeChange?: number;
  source: string;
  sourceUrl?: string;
  timePeriod: string;
  collectedAt: string;
  freshness: FreshnessStatus;
  history?: MarketHistoryPoint[];
}

export interface PersonalizedMarketItem {
  skillId: string;
  skillName: string;
  slug: string;
  category: string;
  careerImportance: 'critical' | 'high' | 'medium' | 'low';
  userCurrentLevel: number;
  userSelfReportedLevel?: string;
  userVerifiedLevel?: string;
  requiredLevelNumber: number;
  requiredLevelName: string;
  gap: number;
  marketSignal?: MarketSkillSignal;
}

export interface PersonalizedMarketResponse {
  targetCareer: {
    id: string;
    name: string;
  };
  items: PersonalizedMarketItem[];
}
