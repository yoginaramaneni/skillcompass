import { Router } from 'express';
import {
  getAvailableSkills,
  startAssessment,
  submitAssessment,
  getAssessmentDetails,
  getUserAssessments,
} from '../controllers/assessments.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/skills', authenticateJWT, asyncHandler(getAvailableSkills));
router.post('/start', authenticateJWT, asyncHandler(startAssessment));
router.post('/:assessmentId/submit', authenticateJWT, asyncHandler(submitAssessment));
router.get('/:assessmentId', authenticateJWT, asyncHandler(getAssessmentDetails));
router.get('/', authenticateJWT, asyncHandler(getUserAssessments));

export default router;
