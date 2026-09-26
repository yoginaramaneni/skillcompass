import { apiClient } from '../lib/axios';
import {
  MarketSkillSignal,
  PersonalizedMarketResponse,
} from '../types/market';

export const getAllMarketSkills = async (): Promise<MarketSkillSignal[]> => {
  const res = await apiClient.get<{ success: boolean; data: MarketSkillSignal[] }>(
    '/market/skills'
  );
  return res.data.data;
};

export const getSkillMarketDetails = async (skillId: string): Promise<MarketSkillSignal> => {
  const res = await apiClient.get<{ success: boolean; data: MarketSkillSignal }>(
    `/market/skills/${skillId}`
  );
  return res.data.data;
};

export const getPersonalizedMarketView = async (): Promise<PersonalizedMarketResponse> => {
  const res = await apiClient.get<{ success: boolean; data: PersonalizedMarketResponse }>(
    '/market/me'
  );
  return res.data.data;
};
