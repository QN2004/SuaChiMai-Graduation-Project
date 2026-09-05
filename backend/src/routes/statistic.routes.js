import express from 'express';
import { bestSellingProducts, dashboard, lowStockProducts, revenueByMonth } from '../controllers/statistic.controller.js';
import { adminOnly, auth } from '../middlewares/auth.js';

const router = express.Router();
router.get('/dashboard', auth, adminOnly, dashboard);
router.get('/revenue-by-month', auth, adminOnly, revenueByMonth);
router.get('/best-selling-products', auth, adminOnly, bestSellingProducts);
router.get('/low-stock-products', auth, adminOnly, lowStockProducts);
export default router;
