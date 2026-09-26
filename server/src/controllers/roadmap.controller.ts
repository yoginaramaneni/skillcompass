import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { roadmapService } from '../services/roadmap.service';
import { ApiError } from '../utils/apiError';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped']),
});

export const generateRoadmap = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = await roadmapService.generateRoadmap(req.user.userId);

  return res.status(200).json({
    success: true,
    message: 'Personalized learning roadmap generated successfully',
    data: result,
  });
};

export const getRoadmap = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = await roadmapService.getLatestRoadmap(req.user.userId);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'No learning roadmap found for this user.',
    });
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const updateRoadmapItemStatus = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { itemId } = req.params;
  if (!itemId) {
    throw new ApiError(400, 'itemId parameter is required.');
  }

  const parsed = updateStatusSchema.parse(req.body);
  const result = await roadmapService.updateItemStatus(req.user.userId, itemId, parsed.status);

  return res.status(200).json({
    success: true,
    message: 'Roadmap item status updated successfully',
    data: result,
  });
};
