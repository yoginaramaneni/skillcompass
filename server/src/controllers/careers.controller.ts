import { Request, Response } from 'express';
import { careerService } from '../services/career.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getCareers = async (req: Request, res: Response) => {
  const careers = await careerService.getCareers();
  return res.status(200).json({
    success: true,
    data: careers,
  });
};

export const getCareerById = async (req: Request, res: Response) => {
  const career = await careerService.getCareerById(req.params.careerId);
  return res.status(200).json({
    success: true,
    data: career,
  });
};

export const compareCareers = async (req: AuthenticatedRequest, res: Response) => {
  const firstCareerId = req.query.firstCareerId as string;
  const secondCareerId = req.query.secondCareerId as string;
  const userId = req.user?.userId;

  const comparisonData = await careerService.compareCareers(firstCareerId, secondCareerId, userId);
  return res.status(200).json({
    success: true,
    data: comparisonData,
  });
};
