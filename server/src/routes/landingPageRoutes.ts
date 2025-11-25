import express from 'express';
import {
  getLandingPages,
  getLandingPage,
  getLandingPageBySlug,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
  submitLandingPageForm,
  publishLandingPage,
  trackLandingPageEvent,
  getLandingPageAnalytics,
} from '../controllers/landingPageController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/slug/:slug', getLandingPageBySlug);
router.post('/:id/submit', submitLandingPageForm);
router.post('/:id/track', trackLandingPageEvent);

// Protected routes
router.use(protect);

router.route('/')
  .get(getLandingPages)
  .post(createLandingPage);

router.route('/:id')
  .get(getLandingPage)
  .put(updateLandingPage)
  .delete(deleteLandingPage);

router.post('/:id/publish', publishLandingPage);
router.get('/:id/analytics', getLandingPageAnalytics);

export default router;
