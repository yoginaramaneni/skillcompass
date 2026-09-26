import { Router } from 'express';
import { getSkills, getUserSkills } from '../controllers/skills.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getSkills));
router.get('/user', authenticateJWT, asyncHandler(getUserSkills));

export default router;
