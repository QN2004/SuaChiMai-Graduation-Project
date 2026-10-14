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
      // e.g. "oc cho" matching inside "hoc cho".
      where.push('(p.name LIKE ? OR COALESCE(b.name, "") LIKE ?)');
      const keyword = `%${q}%`;
      params.push(keyword, keyword);
    }
    if (category) {
      where.push('p.category_id=?');
      params.push(category);
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
    ok(res, 'Thanh cong', { items: rows, total: totalRows[0].total, page: safePage, limit: safeLimit });
  } catch (err) {
    next(err);
  }
};

export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} GROUP BY p.id ORDER BY p.id DESC`);
    ok(res, 'Thanh cong', rows);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.id=? GROUP BY p.id`, [req.params.id]);
    if (!rows.length) return fail(res, 404, 'Khong tim thay san pham');
    ok(res, 'Thanh cong', rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.slug=? AND p.status=1 GROUP BY p.id`, [req.params.slug]);
    if (!rows.length) return fail(res, 404, 'Khong tim thay san pham');
    const related = await query(`${productSelect} WHERE p.category_id=? AND p.id<>? AND p.status=1 GROUP BY p.id LIMIT 4`, [
      rows[0].category_id,
      rows[0].id
    ]);
    ok(res, 'Thanh cong', { product: rows[0], related });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const fields = [
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
    req.body = normalizeProductPayload(req.body);
    req.body.slug = req.body.slug || makeSlug(req.body.name);
    const values = fields.map((f) => req.body[f] ?? null);
    const result = await query(`INSERT INTO products(${fields.join(',')}) VALUES(${fields.map(() => '?').join(',')})`, values);
    ok(res, 'Them san pham thanh cong', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    req.body = normalizeProductPayload(req.body);
    if (req.body.name && !req.body.slug) req.body.slug = makeSlug(req.body.name);
    const fields = Object.keys(req.body).filter((k) => !['id', 'created_at', 'updated_at'].includes(k));
    if (!fields.length) return fail(res, 422, 'Khong co du lieu cap nhat');
    await query(`UPDATE products SET ${fields.map((f) => `${f}=?`).join(',')} WHERE id=?`, [
      ...fields.map((f) => req.body[f]),
      req.params.id
    ]);
    ok(res, 'Cap nhat san pham thanh cong');
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await query('DELETE FROM products WHERE id=?', [req.params.id]);
    ok(res, 'Xoa san pham thanh cong');
  } catch (err) {
    next(err);
  }
};

export const featured = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.status=1 AND p.is_featured=1 GROUP BY p.id ORDER BY p.id DESC LIMIT 8`);
    ok(res, 'Thanh cong', rows);
  } catch (err) {
    next(err);
  }
};

export const latest = async (req, res, next) => {
  try {
    const rows = await query(`${productSelect} WHERE p.status=1 GROUP BY p.id ORDER BY p.id DESC LIMIT 8`);
    ok(res, 'Thanh cong', rows);
  } catch (err) {
    next(err);
  }
};

export const bestSelling = async (req, res, next) => {
  try {
    const rows = await query(`
      ${productSelect}
      LEFT JOIN order_details od ON od.product_id=p.id
      WHERE p.status=1
      GROUP BY p.id
      ORDER BY COALESCE(SUM(od.quantity),0) DESC, p.id DESC
      LIMIT 8
    `);
    ok(res, 'Thanh cong', rows);
  } catch (err) {
    next(err);
  }
};
