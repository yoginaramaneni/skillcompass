import { apiClient } from '../lib/axios';
import {
  AssessmentSkill,
  AssessmentStartResponse,
  AssessmentAnswer,
  AssessmentResult,
  AssessmentDetails,
  AssessmentHistoryItem,
} from '../types/assessment';

export const getAssessmentSkills = async (): Promise<AssessmentSkill[]> => {
  const res = await apiClient.get<{ success: boolean; data: AssessmentSkill[] }>(
    '/assessments/skills'
  );
  return res.data.data;
};

export const startAssessment = async (skillId: string): Promise<AssessmentStartResponse> => {
  const res = await apiClient.post<{ success: boolean; data: AssessmentStartResponse }>(
    '/assessments/start',
    { skillId }
  );
  return res.data.data;
};

export const submitAssessment = async (
  assessmentId: string,
  answers: AssessmentAnswer[]
): Promise<AssessmentResult> => {
  const res = await apiClient.post<{ success: boolean; data: AssessmentResult }>(
    `/assessments/${assessmentId}/submit`,
    { answers }
  );
  return res.data.data;
};

export const getAssessmentDetails = async (
  assessmentId: string
): Promise<AssessmentDetails> => {
  const res = await apiClient.get<{ success: boolean; data: AssessmentDetails }>(
    `/assessments/${assessmentId}`
  );
  return res.data.data;
};

export const getAssessmentHistory = async (): Promise<AssessmentHistoryItem[]> => {
  const res = await apiClient.get<{ success: boolean; data: AssessmentHistoryItem[] }>(
    '/assessments'
  );
  return res.data.data;
};
