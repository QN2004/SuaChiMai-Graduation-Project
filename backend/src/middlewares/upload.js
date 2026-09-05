import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'src/uploads',
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Chi cho phep upload hinh anh'));
    cb(null, true);
  }
});
