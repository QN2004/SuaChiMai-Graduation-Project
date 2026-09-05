import { query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';

export const productReviews = async (req, res, next) => {
  try {
    const rows = await query(
      'SELECT r.*, u.full_name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.product_id=? AND r.status=1 ORDER BY r.id DESC',
      [req.params.productId]
    );
    ok(res, 'Thanh cong', rows);
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { product_id, rating, comment } = req.body;
    const bought = await query(
      `SELECT od.id FROM order_details od
       JOIN orders o ON o.id=od.order_id
       WHERE o.user_id=? AND od.product_id=? AND o.order_status='COMPLETED' LIMIT 1`,
      [req.user.id, product_id]
    );
    if (!bought.length) return fail(res, 403, 'Ban chi duoc danh gia san pham da mua va hoan thanh');
    const result = await query('INSERT INTO reviews(user_id,product_id,rating,comment) VALUES(?,?,?,?)', [
      req.user.id,
      product_id,
      rating,
      comment
    ]);
    ok(res, 'Gui danh gia thanh cong', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const allReviews = async (req, res, next) => {
  try {
    const rows = await query('SELECT r.*, u.full_name, p.name AS product_name FROM reviews r JOIN users u ON u.id=r.user_id JOIN products p ON p.id=r.product_id ORDER BY r.id DESC');
    ok(res, 'Thanh cong', rows);
  } catch (err) {
    next(err);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    await query('UPDATE reviews SET status=? WHERE id=?', [req.body.status, req.params.id]);
    ok(res, 'Cap nhat danh gia thanh cong');
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await query('DELETE FROM reviews WHERE id=?', [req.params.id]);
    ok(res, 'Xoa danh gia thanh cong');
  } catch (err) {
    next(err);
  }
};
