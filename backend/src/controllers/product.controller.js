import { query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';
import { makeSlug } from '../utils/slug.js';

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
  'stock',
  'age_range',
  'origin',
  'weight',
  'ingredients',
  'benefits',
  'usage_instructions',
  'short_description',
  'description',
  'status',
  'is_featured'
];

const normalizeProductPayload = (payload) => ({
  ...payload,
  sale_price: payload.sale_price === '' || payload.sale_price === undefined ? null : payload.sale_price
});

export const getProducts = async (req, res, next) => {
  try {
    const { q, category, brand, minPrice, maxPrice, sort = 'latest', page = 1, limit = 12 } = req.query;
    const where = ['p.status=1'];
    const params = [];
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
    ok(res, 'Thành công', { items: rows, total: totalRows[0].total, page: safePage, limit: safeLimit });
  } catch (err) {
    next(err);
  }
};

export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} GROUP BY p.id ORDER BY p.id DESC`);
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.id=? GROUP BY p.id`, [req.params.id]);
    if (!rows.length) return fail(res, 404, 'Không tìm thấy sản phẩm');
    ok(res, 'Thành công', rows[0]);
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
    ok(res, 'Thành công', { product: rows[0], related });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const fields = productFields;
    req.body = normalizeProductPayload(req.body);
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
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};

export const latest = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.status=1 GROUP BY p.id ORDER BY p.id DESC LIMIT 8`);
    ok(res, 'Thành công', rows);
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
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};
