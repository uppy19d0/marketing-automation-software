import express from 'express';
import { getDashboardOverview, getReportsOverview } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.get('/dashboard', getDashboardOverview);
router.get('/reports', getReportsOverview);

export default router;
