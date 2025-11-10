import express from 'express';
import {
  getSegments,
  getSegment,
  createSegment,
  updateSegment,
  deleteSegment,
  getSegmentContacts,
  previewSegment,
} from '../controllers/segmentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSegments)
  .post(createSegment);

router.post('/preview', previewSegment);

router.route('/:id')
  .get(getSegment)
  .put(updateSegment)
  .delete(deleteSegment);

router.get('/:id/contacts', getSegmentContacts);

export default router;
