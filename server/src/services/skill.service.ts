import { skillsRepository } from '../repositories/skill.repository';

export class SkillService {
  async getSkills(search?: string, category?: string) {
    return skillsRepository.findAllSkills(search, category);
  }

  async getSkillBySlug(slug: string) {
    return skillsRepository.findSkillBySlug(slug);
  }
}

export const skillService = new SkillService();
