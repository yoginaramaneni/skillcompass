import { apiClient } from '../lib/axios';
import { ApiResponse } from '../types';
import { Skill } from '../types/skill';

export const skillService = {
  getSkills: async (search?: string, category?: string): Promise<ApiResponse<Skill[]>> => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;

    const res = await apiClient.get<ApiResponse<Skill[]>>('/skills', { params });
    return res.data;
  },
};
