import { query } from '../config/db.js';
import { fail, ok } from '../utils/response.js';
import { todayVN } from '../utils/expiry.js';
import { buildCareJourney, CONDITIONS, checkProductForBaby, describeBaby, formulaStage, parseConditions, recommendForBaby, replenishmentDue } from '../utils/babyAdvice.js';
import { attachExpiryInfo } from '../services/stock.service.js';

const productCols = `p.id, p.name, p.slug, p.image, p.price, p.sale_price, p.stock, p.usage_days, p.age_range, p.benefits,
  p.short_description, p.audience, p.stage_min_months, p.stage_max_months, p.cmpa_safe, p.lactose_free, p.net_weight_g,
  b.name AS brand_name`;

const loadBabies = async (userId) =>
  (await query('SELECT * FROM baby_profiles WHERE user_id=? ORDER BY is_default DESC, id', [userId])).map((b) => describeBaby(b, todayVN()));

// Bé đang chọn của khách (dùng cho giỏ hàng, trang sản phẩm và trợ lý AI).
export const getDefaultBaby = async (userId, babyId = null) => {
  const babies = await loadBabies(userId);
  return (babyId ? babies.find((b) => b.id === Number(babyId)) : babies[0]) || null;
};

const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) && !Number.isNaN(Date.parse(value));

const readPayload = (body) => {
  const name = String(body.name || '').trim();
  if (!name || name.length > 60) return { error: 'Vui lòng nhập tên bé (tối đa 60 ký tự)' };
  if (!isDate(body.birth_date)) return { error: 'Ngày sinh không hợp lệ' };
  const today = todayVN();
  if (body.birth_date > today) return { error: 'Ngày sinh không được sau hôm nay' };
  if (Number(today.slice(0, 4)) - Number(body.birth_date.slice(0, 4)) > 12) return { error: 'Hồ sơ dành cho trẻ đến 12 tuổi' };
  let weight = null;
  if (body.weight_kg !== undefined && body.weight_kg !== null && body.weight_kg !== '') {
    weight = Number(body.weight_kg);
    if (!(weight >= 0.5 && weight <= 60)) return { error: 'Cân nặng phải từ 0,5 đến 60 kg' };
  }
  const list = Array.isArray(body.conditions) ? body.conditions : String(body.conditions || '').split(',');
  return { name, birth_date: body.birth_date, weight_kg: weight, conditions: parseConditions(list.join(',')).join(',') };
};

const findOwn = async (req) => {
  const rows = await query('SELECT * FROM baby_profiles WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
  return rows[0] || null;
};

export const listBabies = async (req, res, next) => {
  try {
    ok(res, 'Thành công', { babies: await loadBabies(req.user.id), conditions: CONDITIONS });
  } catch (err) {
    next(err);
  }
};

export const createBaby = async (req, res, next) => {
  try {
    const data = readPayload(req.body);
    if (data.error) return fail(res, 422, data.error);
    const [{ total }] = await query('SELECT COUNT(*) total FROM baby_profiles WHERE user_id=?', [req.user.id]);
    if (total >= 10) return fail(res, 400, 'Mỗi tài khoản tạo tối đa 10 hồ sơ bé');
    const result = await query(
      'INSERT INTO baby_profiles(user_id, name, birth_date, weight_kg, conditions, is_default) VALUES(?,?,?,?,?,?)',
      [req.user.id, data.name, data.birth_date, data.weight_kg, data.conditions, total === 0 ? 1 : 0]
    );
    ok(res, 'Đã tạo hồ sơ bé', { id: result.insertId });
  } catch (err) {
    next(err);
  }
};

export const updateBaby = async (req, res, next) => {
  try {
    if (!(await findOwn(req))) return fail(res, 404, 'Không tìm thấy hồ sơ bé');
    const data = readPayload(req.body);
    if (data.error) return fail(res, 422, data.error);
    await query('UPDATE baby_profiles SET name=?, birth_date=?, weight_kg=?, conditions=? WHERE id=?',
      [data.name, data.birth_date, data.weight_kg, data.conditions, req.params.id]);
    ok(res, 'Đã cập nhật hồ sơ bé');
  } catch (err) {
    next(err);
  }
};

export const deleteBaby = async (req, res, next) => {
  try {
    const baby = await findOwn(req);
    if (!baby) return fail(res, 404, 'Không tìm thấy hồ sơ bé');
    await query('DELETE FROM baby_profiles WHERE id=?', [baby.id]);
    if (baby.is_default) {
      await query('UPDATE baby_profiles SET is_default=1 WHERE user_id=? ORDER BY id LIMIT 1', [req.user.id]);
    }
    ok(res, 'Đã xóa hồ sơ bé');
  } catch (err) {
    next(err);
  }
};

export const setDefaultBaby = async (req, res, next) => {
  try {
    if (!(await findOwn(req))) return fail(res, 404, 'Không tìm thấy hồ sơ bé');
    await query('UPDATE baby_profiles SET is_default = (id = ?) WHERE user_id=?', [req.params.id, req.user.id]);
    ok(res, 'Đã chọn bé để tư vấn');
  } catch (err) {
    next(err);
  }
};

export const babyRecommendations = async (req, res, next) => {
  try {
    const baby = await getDefaultBaby(req.user.id, req.params.id);
    if (!baby) return fail(res, 404, 'Không tìm thấy hồ sơ bé');
    const products = await query(`SELECT ${productCols} FROM products p LEFT JOIN brands b ON b.id=p.brand_id WHERE p.status=1 AND p.audience='CHILD'`);
    const items = await attachExpiryInfo(recommendForBaby(products, baby));
    const journey = buildCareJourney(baby);
    const stageProducts = {};
    await Promise.all(journey.stages.map(async (stage) => {
      const previewBaby = {
        ...baby,
        age_months: stage.min,
        age_text: stage.label,
        formula_stage: formulaStage(stage.min)
      };
      stageProducts[stage.key] = await attachExpiryInfo(recommendForBaby(products, previewBaby, 4));
    }));
    const note = items.length ? null
      : baby.conditions.includes('CMPA') || baby.conditions.includes('LACTOSE')
        ? `Cửa hàng hiện chưa có sữa phù hợp cho bé ${baby.condition_labels.join(', ').toLowerCase()}. Bố mẹ nên hỏi bác sĩ để chọn sữa chuyên biệt.`
        : 'Cửa hàng hiện chưa có sản phẩm còn hàng đúng giai đoạn của bé.';
    ok(res, 'Thành công', { baby, journey, stage_products: stageProducts, items, note });
  } catch (err) {
    next(err);
  }
};

// Cảnh báo an toàn cho các sản phẩm trong giỏ theo bé đang chọn (hoặc baby_id).
export const checkCart = async (req, res, next) => {
  try {
    const baby = await getDefaultBaby(req.user.id, req.body.baby_id);
    const ids = [...new Set((req.body.items || []).map((item) => Number(item.product_id)).filter((id) => id > 0))];
    if (!baby || !ids.length) return ok(res, 'Thành công', { baby, warnings: [] });
    const products = await query(`SELECT ${productCols} FROM products p LEFT JOIN brands b ON b.id=p.brand_id WHERE p.id IN (${ids.map(() => '?').join(',')})`, ids);
    const warnings = products
      .map((product) => ({ product_id: product.id, product_name: product.name, warnings: checkProductForBaby(product, baby) }))
      .filter((item) => item.warnings.length);
    ok(res, 'Thành công', { baby, warnings });
  } catch (err) {
    next(err);
  }
};

export const replenishment = async (req, res, next) => {
  try {
    const purchases = await query(
      `SELECT od.product_id, o.id AS order_id, o.created_at AS ordered_at, o.order_status, DATE(o.completed_at) AS completed_at,
         SUM(od.quantity) AS quantity, p.usage_days, p.name, p.slug, p.image, p.price, p.sale_price, p.stock, b.name AS brand_name
       FROM order_details od
       JOIN orders o ON o.id=od.order_id AND o.order_status <> 'CANCELLED'
       JOIN products p ON p.id=od.product_id AND p.status=1
       LEFT JOIN brands b ON b.id=p.brand_id
       WHERE o.user_id=?
       GROUP BY o.id, od.product_id`,
      [req.user.id]
    );
    const due = replenishmentDue(purchases.map((row) => ({ ...row, ordered_at: String(row.ordered_at instanceof Date ? row.ordered_at.toISOString() : row.ordered_at), completed_at: row.completed_at ? String(row.completed_at) : null })), todayVN());
    ok(res, 'Thành công', due.map((row) => ({ ...row, id: row.product_id })));
  } catch (err) {
    next(err);
  }
};
