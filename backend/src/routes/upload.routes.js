import express from 'express';
import { adminOnly, auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { fail, ok } from '../utils/response.js';

const router = express.Router();
router.post('/', auth, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return fail(res, 422, 'Vui lòng chọn hình ảnh');
  ok(res, 'Upload thành công', { url: `/uploads/${req.file.filename}` });
});
export default router;
