import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { marketService } from '../services/market/market.service';
import { ApiError } from '../utils/apiError';

export const getAllMarketSkills = async (req: Request, res: Response) => {
  const signals = marketService.getAllSkillSignals();
  return res.status(200).json({
    success: true,
    data: signals,
  });
};

export const getSkillDetails = async (req: Request, res: Response) => {
  const { skillId } = req.params;
  if (!skillId) {
    throw new ApiError(400, 'skillId parameter is required.');
  }

  const signal = marketService.getSkillDetails(skillId);
  return res.status(200).json({
    success: true,
    data: signal,
  });
};

export const getCareerMarketView = async (req: Request, res: Response) => {
  const { careerId } = req.params;
  if (!careerId) {
    throw new ApiError(400, 'careerId parameter is required.');
  }

  const result = await marketService.getCareerMarketView(careerId);
  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const getPersonalizedMarketView = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = await marketService.getPersonalizedMarketView(req.user.userId);
  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const getMarketTrends = async (req: Request, res: Response) => {
  const signals = marketService.getAllSkillSignals();
  return res.status(200).json({
    success: true,
    data: signals,
  });
};
