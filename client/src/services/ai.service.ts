import { apiClient } from '../lib/axios';
import { SkillIntelligenceResponse } from '../types/ai';

export const generateSkillIntelligence = async (): Promise<SkillIntelligenceResponse> => {
  const response = await apiClient.post<{ success: boolean; data: SkillIntelligenceResponse }>(
    '/ai/skill-intelligence'
  );
  return response.data.data;
};

export const getLatestSkillIntelligence = async (): Promise<SkillIntelligenceResponse | null> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: SkillIntelligenceResponse }>(
      '/ai/skill-intelligence/latest'
    );
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};
