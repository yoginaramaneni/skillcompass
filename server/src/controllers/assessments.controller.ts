import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { assessmentService } from '../services/assessment.service';
import { startAssessmentSchema, submitAssessmentSchema } from '../schemas/assessment.schema';
import { ApiError } from '../utils/apiError';

export const getAvailableSkills = async (req: AuthenticatedRequest, res: Response) => {
  const skills = await assessmentService.getAvailableSkills();
  return res.status(200).json({
    success: true,
    data: skills,
  });
};

export const startAssessment = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const parsed = startAssessmentSchema.parse(req.body);
  const result = await assessmentService.startAssessment(req.user.userId, parsed.skillId);

  return res.status(200).json({
    success: true,
    message: 'Assessment started successfully',
    data: result,
  });
};

export const submitAssessment = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { assessmentId } = req.params;
  if (!assessmentId) {
    throw new ApiError(400, 'Assessment ID parameter is required.');
  }

  const parsed = submitAssessmentSchema.parse(req.body);
  const result = await assessmentService.submitAssessment(req.user.userId, assessmentId, parsed.answers);

  return res.status(200).json({
    success: true,
    message: 'Assessment submitted successfully',
    data: result,
  });
};

export const getAssessmentDetails = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { assessmentId } = req.params;
  if (!assessmentId) {
    throw new ApiError(400, 'Assessment ID parameter is required.');
  }

  const result = await assessmentService.getAssessmentDetails(req.user.userId, assessmentId);

  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const getUserAssessments = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const history = await assessmentService.getUserAssessmentHistory(req.user.userId);

  return res.status(200).json({
    success: true,
    data: history,
  });
};
