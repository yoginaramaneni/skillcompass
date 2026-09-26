import { Router } from 'express';
import { getCareers, getCareerById, compareCareers } from '../controllers/careers.controller';
import { optionalAuthenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getCareers));
router.get('/compare', optionalAuthenticateJWT, asyncHandler(compareCareers));
router.get('/:careerId', asyncHandler(getCareerById));

export default router;
