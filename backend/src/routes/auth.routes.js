import express from 'express';
import { body } from 'express-validator';
import { login, logout, profile, register, updateProfile } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/error.js';

const router = express.Router();
router.post('/register', [body('full_name').notEmpty().withMessage('Vui lòng nhập họ tên'), body('email').isEmail().withMessage('Email không hợp lệ'), body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')], validate, register);
router.post('/login', [body('email').isEmail().withMessage('Email không hợp lệ'), body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu')], validate, login);
router.get('/profile', auth, profile);
router.put('/profile', auth, updateProfile);
router.post('/logout', auth, logout);
export default router;
