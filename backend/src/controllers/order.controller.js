import { pool, query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';
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
    ok(res, 'Thanh cong', rows);
  } catch (err) {
    next(err);
  }
};
export const myOrders = async (req, res, next) => {
  try {
    const rows = await query('SELECT * FROM orders WHERE user_id=? ORDER BY id DESC', [req.user.id]);
    ok(res, 'Thanh cong', rows);
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
    if (!rows.length) return fail(res, 404, 'Khong tim thay don hang');
    ok(res, 'Thanh cong', rows[0]);
  } catch (err) {
    next(err);
  }
};
export const createOrder = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { customer_name, phone, address, note, payment_method = 'COD', items = [] } = req.body;
    if (!items.length) return fail(res, 422, 'Gio hang dang trong');
    await conn.beginTransaction();
    const orderNumber = `CM${Date.now()}${Math.floor(Math.random() * 1000)}`;
    let total = 0;
    const detailRows = [];
    for (const item of items) {
      const [products] = await conn.execute('SELECT id, name, price, sale_price, stock FROM products WHERE id=? AND status=1 FOR UPDATE', [item.product_id]);
      if (!products.length) throw new Error('San pham khong ton tai');
      const product = products[0];
      const qty = Number(item.quantity || 1);
      if (product.stock < qty) throw new Error(`San pham ${product.name} khong du ton kho`);
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
    ok(res, 'Dat hang thanh cong', { id: order.insertId, order_number: orderNumber, total_amount: total });
  } catch (err) {
    await conn.rollback();
    fail(res, 400, err.message);
  } finally {
    conn.release();
  }
};
export const updateStatus = async (req, res, next) => {
  try {
    const { order_status, payment_status } = req.body;
    if (!order_status && !payment_status) return fail(res, 422, 'Vui long chon trang thai');
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
    await query(`UPDATE orders SET ${fields.join(',')} WHERE id=?`, [...params, req.params.id]);
    ok(res, 'Cap nhat trang thai thanh cong');
  } catch (err) {
    next(err);
  }
};
export const cancelOrder = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [orders] = await conn.execute('SELECT * FROM orders WHERE id=? FOR UPDATE', [req.params.id]);
    if (!orders.length) throw new Error('Khong tim thay don hang');
    const order = orders[0];
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) throw new Error('Khong co quyen huy don');
    if (order.order_status !== 'PENDING') throw new Error('Chi co the huy don cho xac nhan');
    const [details] = await conn.execute('SELECT product_id, quantity FROM order_details WHERE order_id=?', [order.id]);
    for (const item of details) {
      await conn.execute('UPDATE products SET stock=stock+? WHERE id=?', [item.quantity, item.product_id]);
    }
    await conn.execute("UPDATE orders SET order_status='CANCELLED' WHERE id=?", [order.id]);
    await conn.commit();
    ok(res, 'Huy don hang thanh cong');
  } catch (err) {
    await conn.rollback();
    fail(res, 400, err.message);
  } finally {
    conn.release();
  }
};
