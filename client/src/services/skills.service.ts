import { apiClient } from '../lib/axios';

export const skillsService = {
  getSkillsCatalog: async () => {
    const res = await apiClient.get('/skills');
    return res.data;
  },
  getUserSkills: async () => {
    const res = await apiClient.get('/skills/user');
    return res.data;
  },
};
