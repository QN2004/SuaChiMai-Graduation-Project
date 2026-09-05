import express from 'express';
import { body } from 'express-validator';
import { create, detail, list, remove, update } from '../controllers/common.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/error.js';

const router = express.Router();
router.get('/', list('brands'));
router.get('/:id', detail('brands'));
router.post('/', auth, adminOnly, [body('name').notEmpty().withMessage('Vui long nhap ten thuong hieu')], validate, create('brands'));
router.put('/:id', auth, adminOnly, update('brands'));
router.delete('/:id', auth, adminOnly, remove('brands'));
export default router;
