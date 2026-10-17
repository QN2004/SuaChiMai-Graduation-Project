import { query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';

export const productReviews = async (req, res, next) => {
  try {
    const rows = await query(
      'SELECT r.*, u.full_name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.product_id=? AND r.status=1 ORDER BY r.id DESC',
      [req.params.productId]
    );
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { product_id, rating, comment } = req.body;
    const score = Number(rating);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return fail(res, 422, 'Đánh giá phải từ 1 đến 5 sao');
    }
    const existing = await query('SELECT id FROM reviews WHERE user_id=? AND product_id=? LIMIT 1', [req.user.id, product_id]);
    if (existing.length) return fail(res, 409, 'Bạn đã đánh giá sản phẩm này');
    const bought = await query(
      `SELECT od.id FROM order_details od
       JOIN orders o ON o.id=od.order_id
       WHERE o.user_id=? AND od.product_id=? AND o.order_status='COMPLETED' LIMIT 1`,
      [req.user.id, product_id]
    );
    if (!bought.length) return fail(res, 403, 'Bạn chỉ được đánh giá sản phẩm đã mua và hoàn thành');
    const result = await query('INSERT INTO reviews(user_id,product_id,rating,comment) VALUES(?,?,?,?)', [
      req.user.id,
      product_id,
      rating,
      comment
    ]);
    ok(res, 'Gửi đánh giá thành công', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const allReviews = async (req, res, next) => {
  try {
    const rows = await query('SELECT r.*, u.full_name, p.name AS product_name FROM reviews r JOIN users u ON u.id=r.user_id JOIN products p ON p.id=r.product_id ORDER BY r.id DESC');
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    await query('UPDATE reviews SET status=? WHERE id=?', [req.body.status, req.params.id]);
    ok(res, 'Cập nhật đánh giá thành công');
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await query('DELETE FROM reviews WHERE id=?', [req.params.id]);
    ok(res, 'Xóa đánh giá thành công');
  } catch (err) {
    next(err);
  }
};
