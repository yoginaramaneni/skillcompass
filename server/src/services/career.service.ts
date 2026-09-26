import { careersRepository } from '../repositories/career.repository';
import { skillsRepository } from '../repositories/skills.repository';
import { ApiError } from '../utils/apiError';
import { levelToNumber } from '../utils/skillLevel';

export class CareerService {
  async getCareers() {
    return careersRepository.findAllRoles();
  }

  async getCareerById(id: string) {
    const role = await careersRepository.findRoleById(id);
    if (!role) {
      throw new ApiError(404, `Career role not found for ID: ${id}`, 'NOT_FOUND');
    }

    const requiredSkills = await careersRepository.findRoleSkills(id);

    return {
      ...role,
      skills: requiredSkills,
    };
  }

  async compareCareers(firstCareerId: string, secondCareerId: string, userId?: string) {
    if (!firstCareerId || !secondCareerId) {
      throw new ApiError(
        400,
        'Both firstCareerId and secondCareerId query parameters are required.',
        'VALIDATION_ERROR'
      );
    }

    const firstCareer = await this.getCareerById(firstCareerId);
    const secondCareer = await this.getCareerById(secondCareerId);

    let userSkills: any[] = [];
    if (userId) {
      userSkills = await skillsRepository.getUserSkills(userId);
    }

    const userSkillMap = new Map<string, any>();
    userSkills.forEach((us) => {
      userSkillMap.set(us.skill_id, us);
    });

    const firstSkillsMap = new Map(firstCareer.skills.map((s: any) => [s.skillId, s]));
    const secondSkillsMap = new Map(secondCareer.skills.map((s: any) => [s.skillId, s]));

    const commonSkills: any[] = [];
    const firstOnlySkills: any[] = [];
    const secondOnlySkills: any[] = [];

    // Analyze first career skills
    firstCareer.skills.forEach((s: any) => {
      const userSkill = userSkillMap.get(s.skillId);
      const skillDetail = {
        ...s,
        userSelfLevel: userSkill?.self_reported_level || 'none',
        userVerifiedLevel: userSkill?.verified_level || 'unverified',
        isUserProficient: userSkill
          ? levelToNumber(userSkill.self_reported_level) >= s.minimumLevelNumber
          : false,
      };

      if (secondSkillsMap.has(s.skillId)) {
        commonSkills.push(skillDetail);
      } else {
        firstOnlySkills.push(skillDetail);
      }
    });

    // Analyze second career skills
    secondCareer.skills.forEach((s: any) => {
      if (!firstSkillsMap.has(s.skillId)) {
        const userSkill = userSkillMap.get(s.skillId);
        secondOnlySkills.push({
          ...s,
          userSelfLevel: userSkill?.self_reported_level || 'none',
          userVerifiedLevel: userSkill?.verified_level || 'unverified',
          isUserProficient: userSkill
            ? levelToNumber(userSkill.self_reported_level) >= s.minimumLevelNumber
            : false,
        });
      }
    });

    // Coverage statistics
    const firstMatched = firstCareer.skills.filter((s: any) => {
      const us = userSkillMap.get(s.skillId);
      return us && levelToNumber(us.self_reported_level) >= s.minimumLevelNumber;
    }).length;

    const secondMatched = secondCareer.skills.filter((s: any) => {
      const us = userSkillMap.get(s.skillId);
      return us && levelToNumber(us.self_reported_level) >= s.minimumLevelNumber;
    }).length;

    return {
      firstCareer,
      secondCareer,
      comparison: {
        commonSkills,
        firstOnlySkills,
        secondOnlySkills,
        userCoverageFirst: {
          total: firstCareer.skills.length,
          matched: firstMatched,
          percentage:
            firstCareer.skills.length > 0
              ? Math.round((firstMatched / firstCareer.skills.length) * 100)
              : 0,
        },
        userCoverageSecond: {
          total: secondCareer.skills.length,
          matched: secondMatched,
          percentage:
            secondCareer.skills.length > 0
              ? Math.round((secondMatched / secondCareer.skills.length) * 100)
              : 0,
        },
      },
    };
  }
}

export const careerService = new CareerService();
