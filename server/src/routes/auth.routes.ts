import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', authRateLimiter, asyncHandler(register));
router.post('/login', authRateLimiter, asyncHandler(login));
router.get('/me', authenticateJWT, asyncHandler(getMe));
router.post('/logout', asyncHandler(logout));

export default router;
