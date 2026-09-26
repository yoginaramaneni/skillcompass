import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticateJWT, asyncHandler(getProfile));
router.put('/', authenticateJWT, asyncHandler(updateProfile));

export default router;
