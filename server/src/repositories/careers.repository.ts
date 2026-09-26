import { queryDatabase } from '../db';
import { DbCareerRole, DbCareerRoleSkill } from '../types/db.types';

export class CareersRepository {
  async findAllRoles(): Promise<DbCareerRole[]> {
    const result = await queryDatabase(
      `SELECT id, name, slug, description, category, created_at, updated_at
       FROM career_roles ORDER BY name ASC`
    );
    return result.rows;
  }

  async findRoleById(id: string): Promise<DbCareerRole | null> {
    const result = await queryDatabase(
      `SELECT id, name, slug, description, category, created_at, updated_at
       FROM career_roles WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findRoleSkills(careerRoleId: string): Promise<DbCareerRoleSkill[]> {
    const result = await queryDatabase(
      `SELECT id, career_role_id, skill_id, importance, minimum_level, created_at, updated_at
       FROM career_role_skills WHERE career_role_id = $1 ORDER BY importance DESC`,
      [careerRoleId]
    );
    return result.rows;
  }
}

export const careersRepository = new CareersRepository();
