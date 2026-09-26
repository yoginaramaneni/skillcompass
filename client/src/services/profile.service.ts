import { apiClient } from '../lib/axios';
import { ApiResponse, StudentProfileData } from '../types';

export const profileService = {
  getProfile: async (): Promise<ApiResponse<StudentProfileData>> => {
    const res = await apiClient.get<ApiResponse<StudentProfileData>>('/profile');
    return res.data;
  },
  updateProfile: async (data: any): Promise<ApiResponse<StudentProfileData>> => {
    const res = await apiClient.put<ApiResponse<StudentProfileData>>('/profile', data);
    return res.data;
  },
};
