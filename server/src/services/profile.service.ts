import { profileRepository } from '../repositories/profile.repository';
import { skillsRepository } from '../repositories/skills.repository';
import { careersRepository } from '../repositories/careers.repository';
import { userRepository } from '../repositories/user.repository';
import { queryDatabase } from '../db';
import { OnboardingProfileInput } from '../schemas/profile.schema';

export class ProfileService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    const profile = await profileRepository.findByUserId(userId);
    const userSkills = await skillsRepository.getUserSkills(userId);
    
    // Fetch skill names for user skills
    const allSkills = await skillsRepository.findAllSkills();
    const skillsMap = new Map(allSkills.map(s => [s.id, s]));

    const enrichedSkills = userSkills.map(us => ({
      ...us,
      skill_name: skillsMap.get(us.skill_id)?.name || 'Unknown Skill',
      category: skillsMap.get(us.skill_id)?.category || 'General',
    }));

    // Fetch Target Career Role details if selected
    let targetCareer = null;
    if (profile?.target_career_id) {
      targetCareer = await careersRepository.findRoleById(profile.target_career_id);
    }

    // Fetch Education, Projects, Courses, Certifications, Experience
    const educationRes = await queryDatabase(
      `SELECT * FROM education WHERE user_id = $1 ORDER BY is_current DESC, start_date DESC`,
      [userId]
    );
    const projectsRes = await queryDatabase(
      `SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    const coursesRes = await queryDatabase(
      `SELECT * FROM courses WHERE user_id = $1 ORDER BY completion_date DESC`,
      [userId]
    );
    const certsRes = await queryDatabase(
      `SELECT * FROM certifications WHERE user_id = $1 ORDER BY issue_date DESC`,
      [userId]
    );
    const experienceRes = await queryDatabase(
      `SELECT * FROM experience WHERE user_id = $1 ORDER BY is_current DESC, start_date DESC`,
      [userId]
    );

    return {
      user: {
        id: user?.id,
        email: user?.email,
        firstName: user?.first_name,
        lastName: user?.last_name,
      },
      profile,
      targetCareer,
      skills: enrichedSkills,
      education: educationRes.rows,
      projects: projectsRes.rows,
      courses: coursesRes.rows,
      certifications: certsRes.rows,
      experience: experienceRes.rows,
    };
  }

  async saveOnboardingProfile(userId: string, input: OnboardingProfileInput) {
    // 1. Update user name if provided
    if (input.firstName || input.lastName) {
      await queryDatabase(
        `UPDATE users SET
           first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [input.firstName || null, input.lastName || null, userId]
      );
    }

    // 2. Upsert profile table
    const updatedProfile = await profileRepository.upsert(userId, {
      headline: input.headline,
      bio: input.bio,
      location: input.location,
      education_level: input.education_level,
      years_of_experience: input.years_of_experience,
      weekly_learning_hours: input.weekly_learning_hours,
      target_career_id: input.target_career_id,
    });

    // 3. Process skills if provided
    if (input.skills && input.skills.length > 0) {
      const allSkills = await skillsRepository.findAllSkills();
      const skillsMap = new Map(allSkills.map(s => [s.slug, s.id]));

      for (const item of input.skills) {
        let targetSkillId = item.skill_id;

        // Lookup or create skill by name if skill_id wasn't provided
        if (!targetSkillId && item.skill_name) {
          const slug = item.skill_name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          if (skillsMap.has(slug)) {
            targetSkillId = skillsMap.get(slug);
          } else {
            const newSkillRes = await queryDatabase(
              `INSERT INTO skills (name, slug, category)
               VALUES ($1, $2, 'General')
               ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
               RETURNING id`,
              [item.skill_name.trim(), slug]
            );
            targetSkillId = newSkillRes.rows[0].id;
          }
        }

        if (targetSkillId) {
          await skillsRepository.upsertUserSkill(userId, targetSkillId, {
            self_reported_level: item.self_reported_level || 'intermediate',
            years_experience: item.years_experience || 0,
            is_primary: item.is_primary || false,
          });
        }
      }
    }

    // 4. Process education
    if (input.institution) {
      await queryDatabase(
        `INSERT INTO education (user_id, institution, degree, field_of_study, is_current)
         VALUES ($1, $2, $3, $4, true)`,
        [userId, input.institution, input.education_level || null, input.field_of_study || null]
      );
    }

    // 5. Process projects
    if (input.projects && input.projects.length > 0) {
      for (const p of input.projects) {
        await queryDatabase(
          `INSERT INTO projects (user_id, name, description, project_url, github_url, role)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, p.name, p.description || null, p.project_url || null, p.github_url || null, p.role || null]
        );
      }
    }

    // 6. Process courses
    if (input.courses && input.courses.length > 0) {
      for (const c of input.courses) {
        await queryDatabase(
          `INSERT INTO courses (user_id, course_name, provider, completion_date, certificate_url, description)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, c.course_name, c.provider || null, c.completion_date || null, c.certificate_url || null, c.description || null]
        );
      }
    }

    // 7. Process certifications
    if (input.certifications && input.certifications.length > 0) {
      for (const cert of input.certifications) {
        await queryDatabase(
          `INSERT INTO certifications (user_id, name, issuer, credential_id, credential_url, issue_date)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, cert.name, cert.issuer, cert.credential_id || null, cert.credential_url || null, cert.issue_date || null]
        );
      }
    }

    // 8. Process experience
    if (input.experience && input.experience.length > 0) {
      for (const exp of input.experience) {
        await queryDatabase(
          `INSERT INTO experience (user_id, company_name, job_title, description, start_date, end_date, is_current)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [userId, exp.company_name, exp.job_title, exp.description || null, exp.start_date || null, exp.end_date || null, exp.is_current || false]
        );
      }
    }

    return this.getProfile(userId);
  }
}

export const profileService = new ProfileService();
