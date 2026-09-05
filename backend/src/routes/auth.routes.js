import express from 'express';
import { body } from 'express-validator';
import { login, logout, profile, register, updateProfile } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/error.js';

const router = express.Router();
router.post('/register', [body('full_name').notEmpty().withMessage('Vui long nhap ho ten'), body('email').isEmail().withMessage('Email khong hop le'), body('password').isLength({ min: 6 }).withMessage('Mat khau toi thieu 6 ky tu')], validate, register);
router.post('/login', [body('email').isEmail().withMessage('Email khong hop le'), body('password').notEmpty().withMessage('Vui long nhap mat khau')], validate, login);
router.get('/profile', auth, profile);
router.put('/profile', auth, updateProfile);
router.post('/logout', auth, logout);
export default router;
