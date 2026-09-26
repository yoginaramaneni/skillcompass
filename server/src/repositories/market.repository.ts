import { queryDatabase } from '../db';
import { DbMarketSkillTrend } from '../types/db.types';

export class MarketRepository {
  async getSkillTrends(careerRoleId?: string): Promise<DbMarketSkillTrend[]> {
    if (careerRoleId) {
      const result = await queryDatabase(
        `SELECT id, skill_id, career_role_id, region, time_period, frequency, trend_direction, trend_score, source, source_url, collected_at, created_at
         FROM market_skill_trends WHERE career_role_id = $1 ORDER BY frequency DESC`,
        [careerRoleId]
      );
      return result.rows;
    }
    const result = await queryDatabase(
      `SELECT id, skill_id, career_role_id, region, time_period, frequency, trend_direction, trend_score, source, source_url, collected_at, created_at
       FROM market_skill_trends ORDER BY frequency DESC LIMIT 50`
    );
    return result.rows;
  }
}

export const marketRepository = new MarketRepository();
