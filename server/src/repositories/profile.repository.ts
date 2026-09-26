import { queryDatabase } from '../db';
import { DbProfile } from '../types/db.types';

const isUuid = (val?: string | null): boolean => {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
};

const resolveCareerRoleId = async (careerIdOrSlug?: string | null): Promise<string | null> => {
  if (!careerIdOrSlug) return null;
  if (isUuid(careerIdOrSlug)) return careerIdOrSlug;

  try {
    const slugMap: Record<string, string> = {
      'role-fsd': 'full-stack-developer',
      'role-fed': 'frontend-developer',
      'role-bed': 'backend-developer',
      'role-swe': 'software-engineer',
      'role-da': 'data-analyst',
      'role-ds': 'data-scientist',
      'role-mle': 'ml-engineer',
      'role-aie': 'ai-engineer',
      'role-devops': 'devops-engineer',
      'role-cloud': 'cloud-engineer',
      'role-sec': 'cybersecurity-engineer',
    };
    const targetSlug = slugMap[careerIdOrSlug] || careerIdOrSlug;

    const res = await queryDatabase(
      `SELECT id FROM career_roles WHERE slug = $1 OR id::text = $2 LIMIT 1`,
      [targetSlug, careerIdOrSlug]
    );

    if (res.rows.length > 0) {
      return res.rows[0].id;
    }
  } catch (err) {}

  return null;
};

export class ProfileRepository {
  async findByUserId(userId: string): Promise<DbProfile | null> {
    const result = await queryDatabase(
      `SELECT id, user_id, headline, bio, location, education_level,
              years_of_experience, weekly_learning_hours, target_career_id,
              created_at, updated_at
       FROM profiles WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async upsert(userId: string, data: Partial<DbProfile>): Promise<DbProfile> {
    const validCareerId = await resolveCareerRoleId(data.target_career_id);

    const result = await queryDatabase(
      `INSERT INTO profiles (user_id, headline, bio, location, education_level, years_of_experience, weekly_learning_hours, target_career_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE SET
         headline = COALESCE(EXCLUDED.headline, profiles.headline),
         bio = COALESCE(EXCLUDED.bio, profiles.bio),
         location = COALESCE(EXCLUDED.location, profiles.location),
         education_level = COALESCE(EXCLUDED.education_level, profiles.education_level),
         years_of_experience = COALESCE(EXCLUDED.years_of_experience, profiles.years_of_experience),
         weekly_learning_hours = COALESCE(EXCLUDED.weekly_learning_hours, profiles.weekly_learning_hours),
         target_career_id = COALESCE(EXCLUDED.target_career_id, profiles.target_career_id),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        userId,
        data.headline || null,
        data.bio || null,
        data.location || null,
        data.education_level || null,
        data.years_of_experience || 0,
        data.weekly_learning_hours || 0,
        validCareerId,
      ]
    );
    return result.rows[0];
  }
}

export const profileRepository = new ProfileRepository();
