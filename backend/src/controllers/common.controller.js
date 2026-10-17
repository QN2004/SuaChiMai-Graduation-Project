import { query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';
import { makeSlug } from '../utils/slug.js';

const editable = {
  categories: ['name', 'slug', 'description', 'image', 'status'],
  brands: ['name', 'slug', 'description', 'logo', 'status'],
};

export const list = (table) => async (req, res, next) => {
  try {
    const rows = await query(`SELECT * FROM ${table} ORDER BY id DESC`);
    ok(res, 'Thành công', rows);
  } catch (err) {
    next(err);
  }
};

export const detail = (table) => async (req, res, next) => {
  try {
    const rows = await query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    if (!rows.length) return fail(res, 404, 'Không tìm thấy dữ liệu');
    ok(res, 'Thành công', rows[0]);
  } catch (err) {
    next(err);
  }
};

export const detailBySlug = (table) => async (req, res, next) => {
  try {
    const rows = await query(`SELECT * FROM ${table} WHERE slug = ? AND status = 1`, [req.params.slug]);
    if (!rows.length) return fail(res, 404, 'Không tìm thấy dữ liệu');
    ok(res, 'Thành công', rows[0]);
  } catch (err) {
    next(err);
  }
};

export const create = (table) => async (req, res, next) => {
  try {
    const fields = editable[table].filter((f) => req.body[f] !== undefined);
    if (fields.includes('name') && !req.body.slug) req.body.slug = makeSlug(req.body.name);
    if (fields.includes('title') && !req.body.slug) req.body.slug = makeSlug(req.body.title);
    const finalFields = editable[table].filter((f) => req.body[f] !== undefined);
    const values = finalFields.map((f) => req.body[f]);
    const marks = finalFields.map(() => '?').join(',');
    const result = await query(`INSERT INTO ${table}(${finalFields.join(',')}) VALUES(${marks})`, values);
    ok(res, 'Thêm mới thành công', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const update = (table) => async (req, res, next) => {
  try {
    if ((req.body.name || req.body.title) && !req.body.slug) req.body.slug = makeSlug(req.body.name || req.body.title);
    const fields = editable[table].filter((f) => req.body[f] !== undefined);
    if (!fields.length) return fail(res, 422, 'Không có dữ liệu cập nhật');
    const sets = fields.map((f) => `${f}=?`).join(',');
    await query(`UPDATE ${table} SET ${sets} WHERE id=?`, [...fields.map((f) => req.body[f]), req.params.id]);
    ok(res, 'Cập nhật thành công');
  } catch (err) {
    next(err);
  }
};

export const remove = (table) => async (req, res, next) => {
  try {
    await query(`DELETE FROM ${table} WHERE id=?`, [req.params.id]);
    ok(res, 'Xóa thành công');
  } catch (err) {
    next(err);
  }
};
