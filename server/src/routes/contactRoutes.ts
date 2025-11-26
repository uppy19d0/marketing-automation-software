import express from 'express';
import multer from 'multer';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  importContacts,
  bulkTagAssignment,
  sendEmailToContacts,
} from '../controllers/contactController';
import { protect } from '../middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.route('/')
  .get(getContacts)
  .post(createContact);

router.post('/import', upload.single('file'), importContacts);
router.post('/bulk-tag', bulkTagAssignment);
router.post('/send-email', sendEmailToContacts);

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

export default router;
