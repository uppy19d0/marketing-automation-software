import express from 'express';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  getCampaignStats,
  sendTestEmail,
  sendCampaignToContact,
} from '../controllers/campaignController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCampaigns)
  .post(createCampaign);

router.route('/:id')
  .get(getCampaign)
  .put(updateCampaign)
  .delete(deleteCampaign);

router.post('/:id/send/contact', sendCampaignToContact);
router.post('/:id/send', sendCampaign);
router.get('/:id/stats', getCampaignStats);
router.post('/test/send', sendTestEmail);

export default router;
