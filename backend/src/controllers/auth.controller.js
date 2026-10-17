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
    if (exists.length) return fail(res, 409, 'Email đã tồn tại');
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users(full_name,email,phone,password) VALUES(?,?,?,?)',
      [full_name, email, phone, hash]
    );
    ok(res, 'Đăng ký thành công', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return fail(res, 401, 'Email hoặc mật khẩu không đúng');
    const user = users[0];
    if (user.status !== 1) return fail(res, 403, 'Tài khoản đang bị khóa');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return fail(res, 401, 'Email hoặc mật khẩu không đúng');
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    ok(res, 'Đăng nhập thành công', { token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

export const profile = (req, res) => ok(res, 'Thông tin tài khoản', req.user);

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
    ok(res, 'Cập nhật thông tin thành công', users[0]);
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => ok(res, 'Đăng xuất thành công');
