import express from 'express';
import { listUsers, updateUserStatus } from '../controllers/user.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';

const router = express.Router();
router.get('/', auth, adminOnly, listUsers);
router.put('/:id/status', auth, adminOnly, updateUserStatus);
export default router;
