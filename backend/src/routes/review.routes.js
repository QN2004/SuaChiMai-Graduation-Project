import express from 'express';
import { adminOnly, auth } from '../middlewares/auth.js';
import { allReviews, createReview, deleteReview, productReviews, updateReviewStatus } from '../controllers/review.controller.js';

const router = express.Router();
router.get('/admin/all', auth, adminOnly, allReviews);
router.get('/product/:productId', productReviews);
router.post('/', auth, createReview);
router.put('/:id/status', auth, adminOnly, updateReviewStatus);
router.delete('/:id', auth, adminOnly, deleteReview);
export default router;
