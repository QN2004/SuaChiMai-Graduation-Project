import { query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';
import { makeSlug } from '../utils/slug.js';
import { attachExpiryInfo, getBatchesOnSale } from '../services/stock.service.js';

const productSelect = `
  SELECT p.*, c.name AS category_name, b.name AS brand_name,
  COALESCE(AVG(r.rating),0) AS average_rating, COUNT(DISTINCT r.id) AS review_count
  FROM products p
  LEFT JOIN categories c ON c.id=p.category_id
  LEFT JOIN brands b ON b.id=p.brand_id
  LEFT JOIN reviews r ON r.product_id=p.id AND r.status=1
`;

const productFields = [
  'category_id',
  'brand_id',
  'name',
  'slug',
  'image',
  'price',
  'sale_price',
  'usage_days',
  'age_range',
  'origin',
  'weight',
  'ingredients',
  'benefits',
  'usage_instructions',
  'short_description',
  'description',
  'status',
  'is_featured',
  'audience',
  'stage_min_months',
  'stage_max_months',
  'cmpa_safe',
  'lactose_free',
  'net_weight_g'
];

// stock không nhận từ form: tồn được tính từ các lô hàng (product_batches).
const normalizeProductPayload = ({ stock, ...payload }) => ({
  ...payload,
  sale_price: payload.sale_price === '' || payload.sale_price === undefined ? null : payload.sale_price,
  ...(payload.usage_days !== undefined ? { usage_days: Math.max(1, Math.trunc(Number(payload.usage_days)) || 30) } : {}),
  ...Object.fromEntries(['stage_min_months', 'stage_max_months', 'net_weight_g']
    .filter((key) => payload[key] !== undefined)
    .map((key) => [key, payload[key] === '' || payload[key] === null ? null : Math.max(0, Math.trunc(Number(payload[key])) || 0)])),
  ...Object.fromEntries(['cmpa_safe', 'lactose_free']
    .filter((key) => payload[key] !== undefined)
    .map((key) => [key, Number(payload[key]) ? 1 : 0])),
  ...(payload.audience !== undefined ? { audience: ['CHILD', 'MOTHER', 'ADULT'].includes(payload.audience) ? payload.audience : 'CHILD' } : {})
});

export const getProducts = async (req, res, next) => {
  try {
    const { q, category, brand, minPrice, maxPrice, sort = 'latest', page = 1, limit = 12, age_months: ageMonths } = req.query;
    const where = ['p.status=1'];
    const params = [];
    // Lọc theo tháng tuổi của bé (trợ lý AI gửi từ hồ sơ bé): bỏ sản phẩm trẻ em sai giai đoạn,
    // vẫn giữ sản phẩm cho mẹ / người lớn.
    if (ageMonths !== undefined && ageMonths !== '' && Number.isInteger(Number(ageMonths)) && Number(ageMonths) >= 0) {
      where.push("(p.audience<>'CHILD' OR (p.stage_min_months <= ? AND (p.stage_max_months IS NULL OR p.stage_max_months > ?)))");
      params.push(Number(ageMonths), Number(ageMonths));
    }
    if (q) {
      // Only name + brand. Searching description causes false hits
      // e.g. "óc chó" matching inside "học cho".
      where.push('(p.name LIKE ? OR COALESCE(b.name, "") LIKE ?)');
      const keyword = `%${q}%`;
      params.push(keyword, keyword);
    }
    if (category) {
      const categoryIds = String(category)
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value) && value > 0);
      if (categoryIds.length) {
        where.push(`p.category_id IN (${categoryIds.map(() => '?').join(',')})`);
        params.push(...categoryIds);
      }
    }
    if (brand) {
      where.push('p.brand_id=?');
      params.push(brand);
    }
    if (minPrice) {
      where.push('COALESCE(p.sale_price,p.price)>=?');
      params.push(minPrice);
    }
    if (maxPrice) {
      where.push('COALESCE(p.sale_price,p.price)<=?');
      params.push(maxPrice);
    }
    const order = sort === 'price_asc' ? 'COALESCE(p.sale_price,p.price) ASC' : sort === 'price_desc' ? 'COALESCE(p.sale_price,p.price) DESC' : 'p.id DESC';
    const safeLimit = Math.max(1, Number(limit) || 12);
    const safePage = Math.max(1, Number(page) || 1);
    const offset = (safePage - 1) * safeLimit;
    const rows = await query(`${productSelect} WHERE ${where.join(' AND ')} GROUP BY p.id ORDER BY ${order} LIMIT ${safeLimit} OFFSET ${offset}`, params);
    const totalRows = await query(
      `SELECT COUNT(DISTINCT p.id) total
       FROM products p
       LEFT JOIN brands b ON b.id=p.brand_id
       WHERE ${where.join(' AND ')}`,
      params
    );
    ok(res, 'Thành công', { items: await attachExpiryInfo(rows), total: totalRows[0].total, page: safePage, limit: safeLimit });
  } catch (err) {
    next(err);
  }
};

export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} GROUP BY p.id ORDER BY p.id DESC`);
    ok(res, 'Thành công', await attachExpiryInfo(rows));
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.id=? GROUP BY p.id`, [req.params.id]);
    if (!rows.length) return fail(res, 404, 'Không tìm thấy sản phẩm');
    const batches = await getBatchesOnSale(rows);
    ok(res, 'Thành công', { ...rows[0], batches_on_sale: batches.get(rows[0].id) });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.slug=? AND p.status=1 GROUP BY p.id`, [req.params.slug]);
    if (!rows.length) return fail(res, 404, 'Không tìm thấy sản phẩm');
    const related = await query(`${productSelect} WHERE p.category_id=? AND p.id<>? AND p.status=1 GROUP BY p.id LIMIT 4`, [
      rows[0].category_id,
      rows[0].id
    ]);
    const batches = await getBatchesOnSale(rows);
    ok(res, 'Thành công', { product: { ...rows[0], batches_on_sale: batches.get(rows[0].id) }, related: await attachExpiryInfo(related) });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const fields = productFields;
    req.body = normalizeProductPayload({ usage_days: 30, ...req.body });
    req.body.slug = req.body.slug || makeSlug(req.body.name);
    const values = fields.map((f) => req.body[f] ?? null);
    const result = await query(`INSERT INTO products(${fields.join(',')}) VALUES(${fields.map(() => '?').join(',')})`, values);
    ok(res, 'Thêm sản phẩm thành công', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    req.body = normalizeProductPayload(req.body);
    if (req.body.name && !req.body.slug) req.body.slug = makeSlug(req.body.name);
    const fields = productFields.filter((key) => Object.prototype.hasOwnProperty.call(req.body, key));
    if (!fields.length) return fail(res, 422, 'Không có dữ liệu cập nhật');
    await query(`UPDATE products SET ${fields.map((f) => `${f}=?`).join(',')} WHERE id=?`, [
      ...fields.map((f) => req.body[f]),
      req.params.id
    ]);
    ok(res, 'Cập nhật sản phẩm thành công');
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await query('DELETE FROM products WHERE id=?', [req.params.id]);
    ok(res, 'Xóa sản phẩm thành công');
  } catch (err) {
    next(err);
  }
};

export const featured = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.status=1 AND p.is_featured=1 GROUP BY p.id ORDER BY p.id DESC LIMIT 8`);
    ok(res, 'Thành công', await attachExpiryInfo(rows));
  } catch (err) {
    next(err);
  }
};

export const latest = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.status=1 GROUP BY p.id ORDER BY p.id DESC LIMIT 8`);
    ok(res, 'Thành công', await attachExpiryInfo(rows));
  } catch (err) {
    next(err);
  }
};

export const bestSelling = async (req, res, next) => {
  try {
    const rows = await query(`
      ${productSelect}
      LEFT JOIN order_details od ON od.product_id=p.id
      LEFT JOIN orders o ON o.id=od.order_id AND o.order_status='COMPLETED'
      WHERE p.status=1
      GROUP BY p.id
      ORDER BY COALESCE(SUM(CASE WHEN o.id IS NULL THEN 0 ELSE od.quantity END),0) DESC, p.id DESC
      LIMIT 8
    `);
    ok(res, 'Thành công', await attachExpiryInfo(rows));
  } catch (err) {
    next(err);
  }
};
