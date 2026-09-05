import express from 'express';
import { create, detail, list, remove, update } from '../controllers/common.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';

const router = express.Router();
router.get('/', list('banners'));
router.get('/:id', detail('banners'));
router.post('/', auth, adminOnly, create('banners'));
router.put('/:id', auth, adminOnly, update('banners'));
router.delete('/:id', auth, adminOnly, remove('banners'));
export default router;
