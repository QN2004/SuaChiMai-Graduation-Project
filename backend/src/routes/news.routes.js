import express from 'express';
import { create, detail, detailBySlug, list, remove, update } from '../controllers/common.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';

const router = express.Router();
router.get('/slug/:slug', detailBySlug('news'));
router.get('/', list('news'));
router.get('/:id', detail('news'));
router.post('/', auth, adminOnly, create('news'));
router.put('/:id', auth, adminOnly, update('news'));
router.delete('/:id', auth, adminOnly, remove('news'));
export default router;
