import { queryDatabase } from '../db';
import { DbSkillGap } from '../types/db.types';

export class SkillGapsRepository {
  async getUserSkillGaps(userId: string, careerRoleId: string): Promise<DbSkillGap[]> {
    const result = await queryDatabase(
      `SELECT id, user_id, career_role_id, skill_id, current_level, required_level,
              gap_score, priority, reason, created_at, updated_at
       FROM skill_gaps WHERE user_id = $1 AND career_role_id = $2
       ORDER BY gap_score DESC`,
      [userId, careerRoleId]
    );
    return result.rows;
  }
}

export const skillGapsRepository = new SkillGapsRepository();
