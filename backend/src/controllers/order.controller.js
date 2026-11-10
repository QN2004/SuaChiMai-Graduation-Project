import { pool, query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';
import { buildOrderLines, todayVN } from '../utils/expiry.js';
import { syncProductStock } from '../services/stock.service.js';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];
const PAYMENT_STATUSES = ['UNPAID', 'PAID'];
// Lý do khi đơn bị hủy. Giao thất bại / Hoàn hàng chỉ có khi hàng đã rời kho (Đã xác nhận, Đang giao).
export const CANCEL_REASONS = ['CUSTOMER', 'STORE', 'DELIVERY_FAILED', 'RETURNED'];
const adminCancelReason = (reason, fromStatus) => {
  const value = reason || 'STORE';
  if (!['STORE', 'DELIVERY_FAILED', 'RETURNED'].includes(value)) throw new Error('Lý do hủy không hợp lệ');
  if (value !== 'STORE' && !['CONFIRMED', 'SHIPPING'].includes(fromStatus)) {
    throw new Error('Giao thất bại / Hoàn hàng chỉ áp dụng cho đơn Đã xác nhận hoặc Đang giao');
  }
  return value;
};

// Trạng thái kế tiếp hợp lệ. COMPLETED và CANCELLED là trạng thái cuối.
// Hủy được từ CONFIRMED/SHIPPING để xử lý bom hàng, giao thất bại, chuyển khoản không thanh toán.
export const ORDER_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPING', 'CANCELLED'],
  SHIPPING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: []
};

// Trả hàng về đúng lô đã lấy lúc đặt (order_detail_batches), rồi tính lại tồn bán được.
const restoreStock = async (conn, orderId) => {
  const [allocations] = await conn.execute(
    `SELECT odb.batch_id, odb.quantity FROM order_detail_batches odb
     JOIN order_details od ON od.id=odb.order_detail_id
     WHERE od.order_id=? AND odb.batch_id IS NOT NULL`,
    [orderId]
  );
  for (const item of allocations) {
    await conn.execute('UPDATE product_batches SET remaining=remaining+? WHERE id=?', [item.quantity, item.batch_id]);
  }
  const [details] = await conn.execute('SELECT product_id FROM order_details WHERE order_id=?', [orderId]);
  await syncProductStock(conn, details.map((item) => item.product_id));
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
    // Truy vết: mỗi dòng đơn lấy bao nhiêu từ lô nào. Khách chỉ thấy HSD, quản trị thấy cả số lô.
    const allocations = await query(
      `SELECT odb.order_detail_id, odb.lot_number, odb.expiry_date, odb.quantity
       FROM order_detail_batches odb JOIN order_details od ON od.id=odb.order_detail_id
       WHERE od.order_id=? ORDER BY odb.expiry_date, odb.id`,
      [rows[0].id]
    );
    const isAdmin = req.user.role === 'admin';
    const order = rows[0];
    const items = (typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []).map((item) => ({
      ...item,
      batches: allocations
        .filter((a) => a.order_detail_id === item.id)
        .map((a) => (isAdmin ? { lot_number: a.lot_number, expiry_date: a.expiry_date, quantity: a.quantity } : { expiry_date: a.expiry_date, quantity: a.quantity }))
    }));
    ok(res, 'Thành công', { ...order, items });
  } catch (err) {
    next(err);
  }
};
// Xem trước giá giỏ hàng theo FEFO (không khóa, không trừ tồn). Giá cuối vẫn do createOrder tính.
export const previewOrder = async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const today = todayVN();
    const lines = [];
    const problems = [];
    for (const item of items) {
      const qty = Number(item.quantity);
      const rows = await query('SELECT id, name, price, sale_price, usage_days FROM products WHERE id=? AND status=1', [item.product_id]);
      if (!rows.length || !Number.isInteger(qty) || qty < 1) {
        problems.push({ product_id: item.product_id, available: 0, message: 'Sản phẩm không còn bán' });
        continue;
      }
      const batches = await query('SELECT * FROM product_batches WHERE product_id=? AND remaining>0 ORDER BY expiry_date, id', [rows[0].id]);
      const result = buildOrderLines(rows[0], batches, qty, today);
      if (!result.lines) {
        problems.push({ product_id: rows[0].id, available: result.available, message: `Chỉ còn ${result.available} sản phẩm` });
        continue;
      }
      lines.push(...result.lines.map(({ parts, ...line }) => line));
    }
    ok(res, 'Thành công', { lines, problems, total: lines.reduce((sum, line) => sum + line.total_price, 0) });
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
    const lines = [];
    const today = todayVN();
    for (const item of items) {
      const [products] = await conn.execute('SELECT id, name, price, sale_price, usage_days FROM products WHERE id=? AND status=1 FOR UPDATE', [item.product_id]);
      if (!products.length) throw new Error('Sản phẩm không tồn tại');
      const product = products[0];
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) throw new Error('Số lượng sản phẩm không hợp lệ');
      // Khóa các lô còn hàng; buildOrderLines chỉ lấy lô còn bán được, theo HSD gần nhất trước (FEFO).
      const [batches] = await conn.execute(
        'SELECT * FROM product_batches WHERE product_id=? AND remaining>0 ORDER BY expiry_date, id FOR UPDATE',
        [product.id]
      );
      const result = buildOrderLines(product, batches, qty, today);
      if (!result.lines) throw new Error(`Sản phẩm ${product.name} không đủ tồn kho`);
      for (const line of result.lines) {
        total += line.total_price;
        lines.push(line);
        for (const part of line.parts) {
          await conn.execute('UPDATE product_batches SET remaining=remaining-? WHERE id=?', [part.quantity, part.batch.id]);
        }
      }
    }
    const [order] = await conn.execute(
      'INSERT INTO orders(order_number, user_id, customer_name, phone, address, note, total_amount, payment_method, payment_status, order_status) VALUES(?,?,?,?,?,?,?,?,?,?)',
      [orderNumber, req.user.id, customer_name, phone, address, note || null, total, payment_method, 'UNPAID', 'PENDING']
    );
    for (const line of lines) {
      const [detail] = await conn.execute(
        'INSERT INTO order_details(order_id, product_id, product_name, price, quantity, total_price) VALUES(?,?,?,?,?,?)',
        [order.insertId, line.product_id, line.product_name, line.unit_price, line.quantity, line.total_price]
      );
      for (const part of line.parts) {
        await conn.execute(
          'INSERT INTO order_detail_batches(order_detail_id, batch_id, lot_number, expiry_date, quantity) VALUES(?,?,?,?,?)',
          [detail.insertId, part.batch.id, part.batch.lot_number, part.batch.expiry_date, part.quantity]
        );
      }
    }
    await syncProductStock(conn, lines.map((line) => line.product_id));
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
      if (!ORDER_TRANSITIONS[order.order_status].includes(order_status)) {
        throw new Error('Không thể chuyển đơn sang trạng thái này');
      }
      if (order_status === 'CANCELLED') {
        adminCancelReason(req.body.cancel_reason, order.order_status);
        await restoreStock(conn, order.id);
      }
    }

    const fields = [];
    const params = [];
    if (order_status) {
      fields.push('order_status=?');
      params.push(order_status);
      if (order_status === 'CANCELLED' && order.order_status !== 'CANCELLED') {
        fields.push('cancel_reason=?');
        params.push(adminCancelReason(req.body.cancel_reason, order.order_status));
      }
      if (order_status === 'COMPLETED' && order.order_status !== 'COMPLETED') fields.push('completed_at=NOW()');
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
    const isAdmin = req.user.role === 'admin';
    // Khách chỉ hủy được đơn chờ xác nhận; quản trị viên còn hủy được đơn đã xác nhận / đang giao
    // (bom hàng, giao thất bại, chuyển khoản không thanh toán) để hoàn lại tồn kho.
    const cancellable = isAdmin ? ORDER_TRANSITIONS[order.order_status].includes('CANCELLED') : order.order_status === 'PENDING';
    if (!cancellable) {
      throw new Error(isAdmin ? 'Không thể hủy đơn đã hoàn thành hoặc đã hủy' : 'Chỉ có thể hủy đơn chờ xác nhận');
    }
    const reason = isAdmin ? adminCancelReason(req.body?.cancel_reason, order.order_status) : 'CUSTOMER';
    await restoreStock(conn, order.id);
    await conn.execute("UPDATE orders SET order_status='CANCELLED', cancel_reason=? WHERE id=?", [reason, order.id]);
    await conn.commit();
    ok(res, 'Hủy đơn hàng thành công');
  } catch (err) {
    await conn.rollback();
    fail(res, 400, err.message);
  } finally {
    conn.release();
  }
};
