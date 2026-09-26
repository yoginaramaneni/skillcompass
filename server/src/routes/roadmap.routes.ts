import { Router } from 'express';
import {
  generateRoadmap,
  getRoadmap,
  updateRoadmapItemStatus,
} from '../controllers/roadmap.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/generate', authenticateJWT, asyncHandler(generateRoadmap));
router.get('/', authenticateJWT, asyncHandler(getRoadmap));
router.put('/items/:itemId', authenticateJWT, asyncHandler(updateRoadmapItemStatus));

export default router;
