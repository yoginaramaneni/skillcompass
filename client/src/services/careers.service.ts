import { apiClient } from '../lib/axios';

export interface CareerComparisonResult {
  firstCareer: any;
  secondCareer: any;
  comparison: {
    commonSkills: any[];
    firstOnlySkills: any[];
    secondOnlySkills: any[];
    userCoverageFirst: { total: number; matched: number; percentage: number };
    userCoverageSecond: { total: number; matched: number; percentage: number };
  };
}

export const careersService = {
  getCareers: async () => {
    const res = await apiClient.get('/careers');
    return res.data;
  },
  getCareerById: async (careerId: string) => {
    const res = await apiClient.get(`/careers/${careerId}`);
    return res.data;
  },
  compareCareers: async (firstCareerId: string, secondCareerId: string) => {
    const res = await apiClient.get<{ success: boolean; data: CareerComparisonResult }>(
      `/careers/compare?firstCareerId=${firstCareerId}&secondCareerId=${secondCareerId}`
    );
    return res.data.data;
  },
};
