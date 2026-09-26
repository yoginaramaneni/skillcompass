import { Router } from 'express';
import {
  handleCoachChat,
  generateSkillIntelligence,
  getLatestSkillIntelligence,
} from '../controllers/ai.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/coach/chat', authenticateJWT, aiRateLimiter, asyncHandler(handleCoachChat));

router.post('/skill-intelligence', authenticateJWT, aiRateLimiter, asyncHandler(generateSkillIntelligence));
router.get('/skill-intelligence/latest', authenticateJWT, asyncHandler(getLatestSkillIntelligence));

export default router;
