import express from 'express';
import { createBatch, listBatches, setBatchDiscount, updateBatch } from '../controllers/batch.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';

const router = express.Router();
router.get('/', auth, adminOnly, listBatches);
router.post('/', auth, adminOnly, createBatch);
router.put('/:id', auth, adminOnly, updateBatch);
router.put('/:id/discount', auth, adminOnly, setBatchDiscount);
export default router;
