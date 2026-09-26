import { apiClient } from '../lib/axios';
import { ApiResponse } from '../types';
import { CareerRole, CareerRoleDetail } from '../types/career';

export const careerService = {
  getCareers: async (): Promise<ApiResponse<CareerRole[]>> => {
    const res = await apiClient.get<ApiResponse<CareerRole[]>>('/careers');
    return res.data;
  },
  getCareerById: async (id: string): Promise<ApiResponse<CareerRoleDetail>> => {
    const res = await apiClient.get<ApiResponse<CareerRoleDetail>>(`/careers/${id}`);
    return res.data;
  },
};
