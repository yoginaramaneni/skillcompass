import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { skillIntelligenceService } from '../ai/skill-intelligence.service';
import { ApiError } from '../utils/apiError';

export const handleCoachChat = async (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'AI Coach chat endpoint stub initialized',
    data: { response: 'AI Coach response handler stub ready' },
  });
};

export const generateSkillIntelligence = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = await skillIntelligenceService.generateAnalysis(req.user.userId);

  return res.status(200).json({
    success: true,
    message: 'Skill intelligence analysis generated successfully',
    data: result,
  });
};

export const getLatestSkillIntelligence = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = await skillIntelligenceService.getLatestAnalysis(req.user.userId);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'No AI skill intelligence analysis found for this user.',
    });
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
};
