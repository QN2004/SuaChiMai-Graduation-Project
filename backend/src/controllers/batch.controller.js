import { pool, query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';
import { BATCH_STATUS, batchPrice, classifyBatch, todayVN } from '../utils/expiry.js';
import { syncProductStock } from '../services/stock.service.js';

const batchSelect = `
  SELECT b.*, p.name AS product_name, p.image AS product_image, p.usage_days, p.price, p.sale_price,
    EXISTS(SELECT 1 FROM order_detail_batches odb WHERE odb.batch_id=b.id) AS used
  FROM product_batches b
  JOIN products p ON p.id=b.product_id
`;

const withClassification = (rows, today = todayVN()) =>
  rows.map((row) => {
    const info = classifyBatch(row, row.usage_days, today);
    const discount = info.status === BATCH_STATUS.NEAR_EXPIRY ? row.discount_percent : null;
    return {
      ...row,
      used: Boolean(row.used),
      ...info,
      unit_price: batchPrice(row.sale_price || row.price, discount)
    };
  });

const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) && !Number.isNaN(Date.parse(value));

const validateBatch = (body) => {
  const lot = String(body.lot_number || '').trim();
  const quantity = Number(body.quantity);
  if (!lot || lot.length > 50) return 'Số lô không hợp lệ (tối đa 50 ký tự)';
  if (!isDate(body.manufactured_date) || !isDate(body.expiry_date)) return 'Ngày sản xuất hoặc hạn sử dụng không hợp lệ';
  if (body.manufactured_date >= body.expiry_date) return 'Ngày sản xuất phải trước hạn sử dụng';
  if (body.manufactured_date > todayVN()) return 'Ngày sản xuất không được sau hôm nay';
  if (!Number.isInteger(quantity) || quantity < 1) return 'Số lượng phải là số nguyên dương';
  return null;
};

export const listBatches = async (req, res, next) => {
  try {
    const { product_id, status, in_stock } = req.query;
    const where = [];
    const params = [];
    if (product_id) {
      where.push('b.product_id=?');
      params.push(product_id);
    }
    if (in_stock === '1') where.push('b.remaining>0');
    const rows = await query(`${batchSelect} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY b.expiry_date, b.id`, params);
    const items = withClassification(rows);
    ok(res, 'Thành công', status ? items.filter((item) => item.status === status) : items);
  } catch (err) {
    next(err);
  }
};

export const createBatch = async (req, res, next) => {
  try {
    const error = validateBatch(req.body);
    if (error) return fail(res, 422, error);
    const products = await query('SELECT id FROM products WHERE id=?', [req.body.product_id]);
    if (!products.length) return fail(res, 404, 'Không tìm thấy sản phẩm');
    const quantity = Number(req.body.quantity);
    const result = await query(
      'INSERT INTO product_batches(product_id, lot_number, manufactured_date, expiry_date, quantity, remaining) VALUES(?,?,?,?,?,?)',
      [req.body.product_id, String(req.body.lot_number).trim(), req.body.manufactured_date, req.body.expiry_date, quantity, quantity]
    );
    await syncProductStock(pool, [Number(req.body.product_id)]);
    ok(res, 'Nhập lô thành công', { id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return fail(res, 409, 'Số lô đã tồn tại cho sản phẩm này');
    next(err);
  }
};

// Chỉ sửa được lô chưa bán đơn nào, để không làm lệch dữ liệu đơn đã lấy từ lô.
export const updateBatch = async (req, res, next) => {
  try {
    const rows = await query(`${batchSelect} WHERE b.id=?`, [req.params.id]);
    if (!rows.length) return fail(res, 404, 'Không tìm thấy lô');
    if (rows[0].used) return fail(res, 400, 'Lô đã có trong đơn hàng, không thể sửa');
    const error = validateBatch(req.body);
    if (error) return fail(res, 422, error);
    const quantity = Number(req.body.quantity);
    await query(
      'UPDATE product_batches SET lot_number=?, manufactured_date=?, expiry_date=?, quantity=?, remaining=? WHERE id=?',
      [String(req.body.lot_number).trim(), req.body.manufactured_date, req.body.expiry_date, quantity, quantity, req.params.id]
    );
    await syncProductStock(pool, [rows[0].product_id]);
    ok(res, 'Cập nhật lô thành công');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return fail(res, 409, 'Số lô đã tồn tại cho sản phẩm này');
    next(err);
  }
};

// Admin duyệt (hoặc sửa) % giảm xả hàng do hệ thống gợi ý; 0 = bỏ giảm giá.
export const setBatchDiscount = async (req, res, next) => {
  try {
    const discount = Number(req.body.discount_percent);
    if (!Number.isInteger(discount) || discount < 0 || discount > 90) return fail(res, 422, 'Mức giảm phải từ 0 đến 90%');
    const rows = await query(`${batchSelect} WHERE b.id=?`, [req.params.id]);
    if (!rows.length) return fail(res, 404, 'Không tìm thấy lô');
    const [batch] = withClassification(rows);
    if (discount > 0 && batch.status !== BATCH_STATUS.NEAR_EXPIRY) {
      return fail(res, 400, 'Chỉ tạo giảm giá xả hàng cho lô đang cận date');
    }
    await query('UPDATE product_batches SET discount_percent=? WHERE id=?', [discount || null, req.params.id]);
    ok(res, discount ? `Đã áp dụng giảm ${discount}% cho lô ${batch.lot_number}` : `Đã bỏ giảm giá lô ${batch.lot_number}`);
  } catch (err) {
    next(err);
  }
};

// Cảnh báo HSD cho admin: lô cận date chưa giảm giá và lô ngừng bán / hết hạn còn hàng.
export const expiryAlerts = async (req, res, next) => {
  try {
    const items = withClassification(await query(`${batchSelect} WHERE b.remaining>0 ORDER BY b.expiry_date, b.id`));
    const nearExpiry = items.filter((item) => item.status === BATCH_STATUS.NEAR_EXPIRY);
    const needDiscount = nearExpiry.filter((item) => !item.discount_percent);
    const blocked = items.filter((item) => item.status === BATCH_STATUS.BLOCKED || item.status === BATCH_STATUS.EXPIRED);
    ok(res, 'Thành công', {
      near_expiry_total: nearExpiry.length,
      need_discount: needDiscount,
      blocked
    });
  } catch (err) {
    next(err);
  }
};
