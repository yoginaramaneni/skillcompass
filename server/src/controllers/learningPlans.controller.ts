import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getLearningPlans = async (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Weekly learning plans endpoint stub initialized',
    data: [],
  });
};
