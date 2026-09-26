export type TrendDirection = 'increasing' | 'stable' | 'decreasing' | 'insufficient_data';
export type FreshnessStatus = 'fresh' | 'aging' | 'stale';

export interface MarketSkillSignal {
  skillId: string;
  skillName: string;
  slug: string;
  category: string;
  mentions: number;
  totalRecords: number;
  mentionRate: number; // percentage e.g. 12.5%
  trendDirection: TrendDirection;
  absoluteChange?: number; // percentage point diff e.g. +2.5%
  relativeChange?: number; // percentage diff e.g. +25%
  source: string;
  sourceUrl?: string;
  timePeriod: string;
  collectedAt: string;
  freshness: FreshnessStatus;
  history?: Array<{
    timePeriod: string;
    mentions: number;
    totalRecords: number;
    mentionRate: number;
  }>;
}

export interface CareerMarketSignalItem {
  skillId: string;
  skillName: string;
  slug: string;
  category: string;
  careerImportance: 'critical' | 'high' | 'medium' | 'low';
  minimumLevel: string;
  marketSignal?: MarketSkillSignal;
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

export interface MarketDatasetImportInput {
  source: string;
  sourceUrl?: string;
  collectedAt: string;
  period: string;
  totalRecords: number;
  records: Array<{
    skill: string;
    mentions: number;
  }>;
}
