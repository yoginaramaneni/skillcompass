import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import skillsRoutes from './skills.routes';
import assessmentsRoutes from './assessments.routes';
import careersRoutes from './careers.routes';
import skillGapsRoutes from './skillGaps.routes';
import roadmapRoutes from './roadmap.routes';
import learningPlansRoutes from './learningPlans.routes';
import marketRoutes from './market.routes';
import aiRoutes from './ai.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillsRoutes);
router.use('/assessments', assessmentsRoutes);
router.use('/careers', careersRoutes);
router.use('/skill-gaps', skillGapsRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/learning-plans', learningPlansRoutes);
router.use('/market', marketRoutes);
router.use('/ai', aiRoutes);

export default router;
