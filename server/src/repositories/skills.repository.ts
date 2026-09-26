import { queryDatabase } from '../db';
import { DbSkill, DbUserSkill } from '../types/db.types';

export class SkillsRepository {
  async findAllSkills(): Promise<DbSkill[]> {
    const result = await queryDatabase(
      `SELECT id, name, slug, category, description, created_at, updated_at
       FROM skills ORDER BY name ASC`
    );
    return result.rows;
  }

  async findSkillBySlug(slug: string): Promise<DbSkill | null> {
    const result = await queryDatabase(
      `SELECT id, name, slug, category, description, created_at, updated_at
       FROM skills WHERE slug = $1`,
      [slug]
    );
    return result.rows[0] || null;
  }

  async getUserSkills(userId: string): Promise<DbUserSkill[]> {
    const result = await queryDatabase(
      `SELECT id, user_id, skill_id, self_reported_level, verified_level,
              years_experience, is_primary, created_at, updated_at
       FROM user_skills WHERE user_id = $1 ORDER BY is_primary DESC, created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async upsertUserSkill(userId: string, skillId: string, data: Partial<DbUserSkill>): Promise<DbUserSkill> {
    const result = await queryDatabase(
      `INSERT INTO user_skills (user_id, skill_id, self_reported_level, verified_level, years_experience, is_primary)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, skill_id) DO UPDATE SET
         self_reported_level = COALESCE(EXCLUDED.self_reported_level, user_skills.self_reported_level),
         verified_level = COALESCE(EXCLUDED.verified_level, user_skills.verified_level),
         years_experience = COALESCE(EXCLUDED.years_experience, user_skills.years_experience),
         is_primary = COALESCE(EXCLUDED.is_primary, user_skills.is_primary),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        userId,
        skillId,
        data.self_reported_level || null,
        data.verified_level || null,
        data.years_experience || 0,
        data.is_primary || false,
      ]
    );
    return result.rows[0];
  }

  async deleteUserSkill(userId: string, skillId: string): Promise<boolean> {
    const result = await queryDatabase(
      `DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2`,
      [userId, skillId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export const skillsRepository = new SkillsRepository();
