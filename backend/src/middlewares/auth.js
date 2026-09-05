import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { fail } from '../utils/response.js';

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return fail(res, 401, 'Vui long dang nhap');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await query('SELECT id, full_name, email, phone, role, status, address FROM users WHERE id = ?', [decoded.id]);
    if (!users.length || users[0].status !== 1) return fail(res, 401, 'Tai khoan khong hop le');
    req.user = users[0];
    next();
  } catch {
    fail(res, 401, 'Token khong hop le hoac da het han');
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return fail(res, 403, 'Ban khong co quyen admin');
  next();
};
