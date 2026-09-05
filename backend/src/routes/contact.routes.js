import express from 'express';
import { createContact, listContacts, replyContact, updateContactStatus } from '../controllers/contact.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';

const router = express.Router();
router.post('/', createContact);
router.get('/', auth, adminOnly, listContacts);
router.put('/:id/status', auth, adminOnly, updateContactStatus);
router.put('/:id/reply', auth, adminOnly, replyContact);
export default router;
