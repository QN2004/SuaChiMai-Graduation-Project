import { query } from '../config/db.js';
import { ok } from '../utils/response.js';

export const listUsers = async (req, res, next) => {
  try {
    const rows = await query("SELECT id, full_name, email, phone, role, status, address, created_at FROM users WHERE role='user' ORDER BY id DESC");
    ok(res, 'Thanh cong', rows);
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    await query('UPDATE users SET status=? WHERE id=? AND role="user"', [req.body.status, req.params.id]);
    ok(res, 'Cap nhat khach hang thanh cong');
  } catch (err) {
    next(err);
  }
};
