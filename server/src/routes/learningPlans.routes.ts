import { Router } from 'express';
import { getLearningPlans } from '../controllers/learningPlans.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticateJWT, asyncHandler(getLearningPlans));

export default router;
