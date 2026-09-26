import { Router } from 'express';
import { getSkillGaps } from '../controllers/skillGaps.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticateJWT, asyncHandler(getSkillGaps));

export default router;
