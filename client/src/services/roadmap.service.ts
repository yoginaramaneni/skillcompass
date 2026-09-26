import { apiClient } from '../lib/axios';
import { LearningRoadmap, ItemStatusType } from '../types/roadmap';

export const generateRoadmap = async (): Promise<LearningRoadmap> => {
  const res = await apiClient.post<{ success: boolean; data: LearningRoadmap }>(
    '/roadmap/generate'
  );
  return res.data.data;
};

export const getLatestRoadmap = async (): Promise<LearningRoadmap | null> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: LearningRoadmap }>(
      '/roadmap'
    );
    return res.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

export const updateRoadmapItemStatus = async (
  itemId: string,
  status: ItemStatusType
): Promise<LearningRoadmap> => {
  const res = await apiClient.put<{ success: boolean; data: LearningRoadmap }>(
    `/roadmap/items/${itemId}`,
    { status }
  );
  return res.data.data;
};
