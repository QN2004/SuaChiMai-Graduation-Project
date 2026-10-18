import express from 'express';
import multer from 'multer';
import { chat } from '../controllers/chat.controller.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = express.Router();
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    callback(allowed.includes(file.mimetype) ? null : new Error('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP'), allowed.includes(file.mimetype));
  }
});

router.post('/messages', optionalAuth, imageUpload.single('file'), chat);

export default router;
