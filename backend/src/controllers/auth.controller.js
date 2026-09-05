import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';

const publicUser = (u) => ({
  id: u.id,
  full_name: u.full_name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  status: u.status,
  address: u.address
});

export const register = async (req, res, next) => {
  try {
    const { full_name, email, phone, password } = req.body;
    const exists = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return fail(res, 409, 'Email da ton tai');
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users(full_name,email,phone,password) VALUES(?,?,?,?)',
      [full_name, email, phone, hash]
    );
    ok(res, 'Dang ky thanh cong', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return fail(res, 401, 'Email hoac mat khau khong dung');
    const user = users[0];
    if (user.status !== 1) return fail(res, 403, 'Tai khoan dang bi khoa');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return fail(res, 401, 'Email hoac mat khau khong dung');
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    ok(res, 'Dang nhap thanh cong', { token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

export const profile = (req, res) => ok(res, 'Thong tin tai khoan', req.user);

export const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone, address } = req.body;
    await query('UPDATE users SET full_name=?, phone=?, address=? WHERE id=?', [
      full_name,
      phone,
      address || null,
      req.user.id
    ]);
    const users = await query('SELECT id, full_name, email, phone, role, status, address FROM users WHERE id=?', [req.user.id]);
    ok(res, 'Cap nhat thong tin thanh cong', users[0]);
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => ok(res, 'Dang xuat thanh cong');
