import { query } from '../config/db.js';
import { ok } from '../utils/response.js';

export const dashboard = async (req, res, next) => {
  try {
    const [[products], [categories], [brands], [users], [orders], [revenue], [pending], lowStock, latestOrders] = await Promise.all([
      query('SELECT COUNT(*) total FROM products'),
      query('SELECT COUNT(*) total FROM categories'),
      query('SELECT COUNT(*) total FROM brands'),
      query("SELECT COUNT(*) total FROM users WHERE role='user'"),
      query('SELECT COUNT(*) total FROM orders'),
      query("SELECT COALESCE(SUM(total_amount),0) total FROM orders WHERE order_status='COMPLETED'"),
      query("SELECT COUNT(*) total FROM orders WHERE order_status='PENDING'"),
      query('SELECT id, name, stock FROM products WHERE stock <= 10 ORDER BY stock ASC LIMIT 8'),
      query('SELECT * FROM orders ORDER BY id DESC LIMIT 8')
    ]);
    ok(res, 'Thành công', { products, categories, brands, users, orders, revenue, pending, lowStock, latestOrders });
  } catch (err) {
    next(err);
  }
};

export const revenueByMonth = async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT DATE_FORMAT(created_at,'%Y-%m') month, SUM(total_amount) revenue
      FROM orders WHERE order_status='COMPLETED'
      GROUP BY month ORDER BY month DESC LIMIT 12
    `);
    ok(res, 'Thành công', rows.reverse());
  } catch (err) {
    next(err);
  }
};

export const bestSellingProducts = async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT p.id, p.name, p.image, SUM(od.quantity) sold
      FROM order_details od JOIN products p ON p.id=od.product_id
      GROUP BY p.id ORDER BY sold DESC LIMIT 10
    `);
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};

export const lowStockProducts = async (req, res, next) => {
  try {
    const rows = await query('SELECT id, name, image, stock FROM products WHERE stock <= 10 ORDER BY stock ASC LIMIT 20');
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};
