import express from 'express';
import {
  babyRecommendations,
  checkCart,
  createBaby,
  deleteBaby,
  listBabies,
  replenishment,
  setDefaultBaby,
  updateBaby
} from '../controllers/baby.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);
router.get('/', listBabies);
router.post('/', createBaby);
router.get('/replenishment', replenishment);
router.post('/check-cart', checkCart);
router.put('/:id', updateBaby);
router.delete('/:id', deleteBaby);
router.put('/:id/default', setDefaultBaby);
router.get('/:id/recommendations', babyRecommendations);
export default router;
