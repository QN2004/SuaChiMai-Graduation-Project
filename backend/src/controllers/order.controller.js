import { pool, query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];
const PAYMENT_STATUSES = ['UNPAID', 'PAID'];

const restoreStock = async (conn, orderId) => {
  const [details] = await conn.execute('SELECT product_id, quantity FROM order_details WHERE order_id=?', [orderId]);
  for (const item of details) {
    await conn.execute('UPDATE products SET stock=stock+? WHERE id=?', [item.quantity, item.product_id]);
  }
};

const reserveStock = async (conn, orderId) => {
  const [details] = await conn.execute('SELECT product_id, quantity FROM order_details WHERE order_id=?', [orderId]);
  for (const item of details) {
    const [products] = await conn.execute('SELECT id, name, stock FROM products WHERE id=? FOR UPDATE', [item.product_id]);
    if (!products.length) throw new Error('Sản phẩm không tồn tại');
    if (products[0].stock < item.quantity) {
      throw new Error(`Sản phẩm ${products[0].name} không đủ tồn kho`);
    }
    await conn.execute('UPDATE products SET stock=stock-? WHERE id=?', [item.quantity, item.product_id]);
  }
};
const orderDetailSql = `
  SELECT o.*, JSON_ARRAYAGG(JSON_OBJECT(
    'id', od.id, 'product_id', od.product_id, 'product_name', od.product_name,
    'price', od.price, 'quantity', od.quantity, 'total_price', od.total_price,
    'image', p.image
  )) AS items
  FROM orders o
  LEFT JOIN order_details od ON od.order_id=o.id
  LEFT JOIN products p ON p.id=od.product_id
`;
export const listOrders = async (req, res, next) => {
  try {
    const { status, q } = req.query;
    const where = [];
    const params = [];
    if (status) {
      where.push('o.order_status=?');
      params.push(status);
    }
    if (q) {
      where.push('(o.id LIKE ? OR o.customer_name LIKE ? OR o.phone LIKE ? OR o.order_number LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }
    const rows = await query(`SELECT o.*, u.email FROM orders o LEFT JOIN users u ON u.id=o.user_id ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY o.id DESC`, params);
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};
export const myOrders = async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT o.*,
        COUNT(od.id) AS item_count,
        COALESCE(SUM(od.quantity), 0) AS item_qty
      FROM orders o
      LEFT JOIN order_details od ON od.order_id = o.id
      WHERE o.user_id=?
      GROUP BY o.id
      ORDER BY o.id DESC`,
      [req.user.id]
    );
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};
export const getOrder = async (req, res, next) => {
  try {
    const params = [req.params.id];
    const ownerClause = req.user.role === 'admin' ? '' : ' AND o.user_id=?';
    if (req.user.role !== 'admin') params.push(req.user.id);
    const rows = await query(`${orderDetailSql} WHERE o.id=?${ownerClause} GROUP BY o.id`, params);
    if (!rows.length) return fail(res, 404, 'Không tìm thấy đơn hàng');
    ok(res, 'Thành công', rows[0]);
  } catch (err) {
    next(err);
  }
};
export const createOrder = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { customer_name, phone, address, note, payment_method = 'COD', items = [] } = req.body;
    if (!items.length) return fail(res, 422, 'Giỏ hàng đang trống');
    await conn.beginTransaction();
    const orderNumber = `CM${Date.now()}${Math.floor(Math.random() * 1000)}`;
    let total = 0;
    const detailRows = [];
    for (const item of items) {
      const [products] = await conn.execute('SELECT id, name, price, sale_price, stock FROM products WHERE id=? AND status=1 FOR UPDATE', [item.product_id]);
      if (!products.length) throw new Error('Sản phẩm không tồn tại');
      const product = products[0];
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) throw new Error('Số lượng sản phẩm không hợp lệ');
      if (product.stock < qty) throw new Error(`Sản phẩm ${product.name} không đủ tồn kho`);
      const price = Number(product.sale_price || product.price);
      total += price * qty;
      detailRows.push({ product, qty, price, total_price: price * qty });
      await conn.execute('UPDATE products SET stock=stock-? WHERE id=?', [qty, product.id]);
    }
    const [order] = await conn.execute(
      'INSERT INTO orders(order_number, user_id, customer_name, phone, address, note, total_amount, payment_method, payment_status, order_status) VALUES(?,?,?,?,?,?,?,?,?,?)',
      [orderNumber, req.user.id, customer_name, phone, address, note || null, total, payment_method, 'UNPAID', 'PENDING']
    );
    for (const item of detailRows) {
      await conn.execute(
        'INSERT INTO order_details(order_id, product_id, product_name, price, quantity, total_price) VALUES(?,?,?,?,?,?)',
        [order.insertId, item.product.id, item.product.name, item.price, item.qty, item.total_price]
      );
    }
    await conn.commit();
    ok(res, 'Đặt hàng thành công', { id: order.insertId, order_number: orderNumber, total_amount: total });
  } catch (err) {
    await conn.rollback();
    fail(res, 400, err.message);
  } finally {
    conn.release();
  }
};
export const updateStatus = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { order_status, payment_status } = req.body;
    if (!order_status && !payment_status) return fail(res, 422, 'Vui lòng chọn trạng thái');
    if (order_status && !ORDER_STATUSES.includes(order_status)) {
      return fail(res, 422, 'Trạng thái đơn không hợp lệ');
    }
    if (payment_status && !PAYMENT_STATUSES.includes(payment_status)) {
      return fail(res, 422, 'Trạng thái thanh toán không hợp lệ');
    }

    await conn.beginTransaction();
    const [orders] = await conn.execute('SELECT * FROM orders WHERE id=? FOR UPDATE', [req.params.id]);
    if (!orders.length) {
      await conn.rollback();
      return fail(res, 404, 'Không tìm thấy đơn hàng');
    }

    const order = orders[0];
    if (order_status && order_status !== order.order_status) {
      const wasCancelled = order.order_status === 'CANCELLED';
      const willCancel = order_status === 'CANCELLED';
      if (willCancel && !wasCancelled) await restoreStock(conn, order.id);
      if (wasCancelled && !willCancel) await reserveStock(conn, order.id);
    }

    const fields = [];
    const params = [];
    if (order_status) {
      fields.push('order_status=?');
      params.push(order_status);
    }
    if (payment_status) {
      fields.push('payment_status=?');
      params.push(payment_status);
    }
    await conn.execute(`UPDATE orders SET ${fields.join(',')} WHERE id=?`, [...params, req.params.id]);
    await conn.commit();
    ok(res, 'Cập nhật trạng thái thành công');
  } catch (err) {
    await conn.rollback();
    fail(res, 400, err.message);
  } finally {
    conn.release();
  }
};
export const cancelOrder = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [orders] = await conn.execute('SELECT * FROM orders WHERE id=? FOR UPDATE', [req.params.id]);
    if (!orders.length) throw new Error('Không tìm thấy đơn hàng');
    const order = orders[0];
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) throw new Error('Không có quyền hủy đơn');
    if (order.order_status !== 'PENDING') throw new Error('Chỉ có thể hủy đơn chờ xác nhận');
    await restoreStock(conn, order.id);
    await conn.execute("UPDATE orders SET order_status='CANCELLED' WHERE id=?", [order.id]);
    await conn.commit();
    ok(res, 'Hủy đơn hàng thành công');
  } catch (err) {
    await conn.rollback();
    fail(res, 400, err.message);
  } finally {
    conn.release();
  }
};
