import { TrendDirection, FreshnessStatus } from '../../types/market';

export interface TimePoint {
  timePeriod: string;
  mentions: number;
  totalRecords: number;
  mentionRate: number;
}

export class TrendService {
  calculateTrend(history: TimePoint[]): {
    trendDirection: TrendDirection;
    absoluteChange?: number;
    relativeChange?: number;
  } {
    if (!history || history.length < 2) {
      return { trendDirection: 'insufficient_data' };
    }

    // Sort chronologically by timePeriod
    const sorted = [...history].sort((a, b) => a.timePeriod.localeCompare(b.timePeriod));
    const previous = sorted[sorted.length - 2];
    const current = sorted[sorted.length - 1];

    const absoluteChange = Math.round((current.mentionRate - previous.mentionRate) * 100) / 100;
    const relativeChange = previous.mentionRate > 0
      ? Math.round(((current.mentionRate - previous.mentionRate) / previous.mentionRate) * 100 * 100) / 100
      : 0;

    let trendDirection: TrendDirection = 'stable';
    if (absoluteChange > 1.0) {
      trendDirection = 'increasing';
    } else if (absoluteChange < -1.0) {
      trendDirection = 'decreasing';
    }

    return {
      trendDirection,
      absoluteChange,
      relativeChange,
    };
  }

  calculateFreshness(collectedAtStr: string): FreshnessStatus {
    try {
      const collectedDate = new Date(collectedAtStr).getTime();
      const now = Date.now();
      const diffDays = Math.floor((now - collectedDate) / (1000 * 60 * 60 * 24));

      const freshDays = parseInt(process.env.MARKET_DATA_FRESH_DAYS || '90', 10);
      const agingDays = parseInt(process.env.MARKET_DATA_AGING_DAYS || '180', 10);

      if (diffDays <= freshDays) return 'fresh';
      if (diffDays <= agingDays) return 'aging';
      return 'stale';
    } catch {
      return 'fresh';
    }
  }
}

export const trendService = new TrendService();
