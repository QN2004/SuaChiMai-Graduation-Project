import express from 'express';
import { body } from 'express-validator';
import { create, detail, list, remove, update } from '../controllers/common.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/error.js';

const router = express.Router();
router.get('/', list('categories'));
router.get('/:id', detail('categories'));
router.post('/', auth, adminOnly, [body('name').notEmpty().withMessage('Vui lòng nhập tên danh mục')], validate, create('categories'));
router.put('/:id', auth, adminOnly, update('categories'));
router.delete('/:id', auth, adminOnly, remove('categories'));
export default router;
