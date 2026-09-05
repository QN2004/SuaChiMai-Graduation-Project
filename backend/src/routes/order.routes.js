import express from 'express';
import { adminOnly, auth } from '../middlewares/auth.js';
import { cancelOrder, createOrder, getOrder, listOrders, myOrders, updateStatus } from '../controllers/order.controller.js';

const router = express.Router();
router.get('/', auth, adminOnly, listOrders);
router.get('/my-orders', auth, myOrders);
router.get('/:id', auth, getOrder);
router.post('/', auth, createOrder);
router.put('/:id/status', auth, adminOnly, updateStatus);
router.put('/:id/cancel', auth, cancelOrder);
export default router;
