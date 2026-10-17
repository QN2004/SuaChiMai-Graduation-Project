import express from 'express';
import { body } from 'express-validator';
import { bestSelling, createProduct, deleteProduct, featured, getAllProductsAdmin, getProduct, getProductBySlug, getProducts, latest, updateProduct } from '../controllers/product.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/error.js';

const router = express.Router();
router.get('/featured', featured);
router.get('/latest', latest);
router.get('/best-selling', bestSelling);
router.get('/admin/all', auth, adminOnly, getAllProductsAdmin);
router.get('/slug/:slug', getProductBySlug);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', auth, adminOnly, [body('name').notEmpty().withMessage('Vui lòng nhập tên sản phẩm'), body('price').isFloat({ min: 0 }).withMessage('Giá không hợp lệ')], validate, createProduct);
router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);
export default router;
