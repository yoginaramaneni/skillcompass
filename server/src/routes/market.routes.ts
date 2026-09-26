import { Router } from 'express';
import {
  getAllMarketSkills,
  getSkillDetails,
  getCareerMarketView,
  getPersonalizedMarketView,
  getMarketTrends,
} from '../controllers/market.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/skills', asyncHandler(getAllMarketSkills));
router.get('/skills/:skillId', asyncHandler(getSkillDetails));
router.get('/careers/:careerId', asyncHandler(getCareerMarketView));
router.get('/me', authenticateJWT, asyncHandler(getPersonalizedMarketView));
router.get('/trends', asyncHandler(getMarketTrends));

export default router;
