import { apiClient } from '../lib/axios';
import { ApiResponse, User } from '../types';

export const authService = {
  register: async (data: { email: string; password: string; firstName: string; lastName: string }): Promise<ApiResponse> => {
    const res = await apiClient.post<ApiResponse>('/auth/register', data);
    return res.data;
  },
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse> => {
    const res = await apiClient.post<ApiResponse>('/auth/login', credentials);
    return res.data;
  },
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  logout: async (): Promise<ApiResponse> => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },
};
