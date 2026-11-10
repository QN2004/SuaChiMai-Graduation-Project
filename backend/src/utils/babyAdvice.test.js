import test from 'node:test';
import assert from 'node:assert/strict';
import { ageInMonths, buildCareJourney, checkProductForBaby, describeBaby, diaperSize, formulaStage, recommendForBaby, replenishmentDue } from './babyAdvice.js';

const today = '2026-11-12';
const baby = (birth, conditions = '', weight = 6) => describeBaby({ name: 'Bông', birth_date: birth, weight_kg: weight, conditions }, today);
const formula = (id, min, max, extra = {}) => ({ id, name: `Sữa ${id}`, audience: 'CHILD', stage_min_months: min, stage_max_months: max, cmpa_safe: 0, lactose_free: 0, stock: 10, ...extra });

test('tính tháng tuổi theo ngày sinh (chưa tròn tháng thì chưa tính)', () => {
  assert.equal(ageInMonths('2026-08-12', today), 3);
  assert.equal(ageInMonths('2026-08-13', today), 2);
  assert.equal(ageInMonths('2025-09-12', today), 14);
});

test('quy đổi cân nặng sang size bỉm, chọn size còn chỗ cho bé lớn', () => {
  assert.equal(diaperSize(3).size, 'NB');
  assert.equal(diaperSize(4.5).size, 'S');
  assert.equal(diaperSize(7.5).size, 'M');
  assert.equal(diaperSize(10.5).size, 'L');
  assert.equal(diaperSize(13.5).size, 'XL');
  assert.equal(diaperSize(null), null);
});

test('quy đổi tháng tuổi sang công thức sữa số 1/2/3/4', () => {
  assert.deepEqual([0, 5, 6, 11, 12, 35, 36].map((m) => formulaStage(m).stage), [1, 1, 2, 2, 3, 3, 4]);
});

test('bé 3 tháng mua sữa cho trẻ trên 1 tuổi: cảnh báo độ tuổi', () => {
  const warnings = checkProductForBaby(formula(1, 12, 24), baby('2026-08-12'));
  assert.equal(warnings[0].type, 'AGE');
  assert.equal(warnings[0].level, 'danger');
  assert.match(warnings[0].message, /từ 1 tuổi, bé Bông mới 3 tháng/);
});

test('bé dị ứng đạm bò: cảnh báo với sữa thường, không cảnh báo sữa an toàn', () => {
  const b = baby('2026-08-12', 'CMPA');
  assert.equal(checkProductForBaby(formula(1, 0, 6), b)[0].type, 'CMPA');
  assert.equal(checkProductForBaby(formula(2, 0, 6, { cmpa_safe: 1 }), b).length, 0);
  // sữa bầu mua cho mẹ: không xét theo bé
  assert.equal(checkProductForBaby({ ...formula(3, null, null), audience: 'MOTHER' }, b).length, 0);
});

test('bé đã lớn hơn giai đoạn của sữa: nhắc chuyển giai đoạn (mức cảnh báo nhẹ)', () => {
  const w = checkProductForBaby(formula(1, 0, 6), baby('2026-03-12'));
  assert.deepEqual([w[0].type, w[0].level], ['AGE', 'warn']);
});

test('gợi ý chỉ lấy sản phẩm đúng giai đoạn, an toàn, còn hàng; ưu tiên hợp cơ địa', () => {
  const b = baby('2025-09-12', 'CONSTIPATION', 10.5);
  const list = recommendForBaby([
    formula(1, 0, 6),
    formula(2, 12, 24),
    formula(3, 12, 36, { benefits: 'Bổ sung chất xơ hỗ trợ tiêu hóa' }),
    formula(4, 12, 24, { stock: 0 })
  ], b);
  assert.deepEqual(list.map((p) => p.id), [3]);
  assert.ok(list[0].match_reasons.includes('hỗ trợ tiêu hóa'));
  assert.equal(recommendForBaby([formula(1, 0, 12)], baby('2026-08-12', 'CMPA')).length, 0);
});

test('bé giai đoạn số 2 không nhận sữa số 1 hoặc dòng tuổi rộng 0–12 tháng', () => {
  const b = baby('2026-03-12', 'UNDERWEIGHT', 7.5);
  const list = recommendForBaby([
    formula(1, 6, 12, { name: 'Sữa số 2 tăng cân' }),
    formula(2, 0, 12, { name: 'Sữa số 1 dùng 0–12 tháng' }),
    formula(3, 0, 6, { name: 'Sữa số 1 dùng 0–6 tháng' }),
    formula(4, 12, 36, { name: 'Sữa số 3' })
  ], b);
  assert.deepEqual(list.map((p) => p.id), [1]);
});

test('kiểm thử nhiều hồ sơ: mỗi độ tuổi chọn đúng giai đoạn và sản phẩm', () => {
  const products = [
    formula(1, 0, 6), formula(2, 6, 12), formula(3, 12, 36), formula(4, 36, 72),
    formula(5, 0, 6, { cmpa_safe: 1 })
  ];
  const cases = [
    { profile: baby('2026-08-12'), expectedStage: 1, expectedProducts: [5, 1] },
    { profile: baby('2026-03-12'), expectedStage: 2, expectedProducts: [2] },
    { profile: baby('2025-09-12'), expectedStage: 3, expectedProducts: [3] },
    { profile: baby('2022-11-12'), expectedStage: 4, expectedProducts: [4] },
    { profile: baby('2026-08-12', 'CMPA'), expectedStage: 1, expectedProducts: [5] }
  ];
  for (const item of cases) {
    assert.equal(item.profile.formula_stage.stage, item.expectedStage);
    assert.deepEqual(recommendForBaby(products, item.profile).map((p) => p.id), item.expectedProducts);
  }
});

test('hành trình chăm sóc có đủ các giai đoạn và cá nhân hóa theo cơ địa', () => {
  const journey = buildCareJourney(baby('2026-08-12', 'CMPA'));
  assert.equal(journey.current_stage, 'newborn');
  assert.equal(journey.stages.length, 5);
  assert.equal(journey.stages.filter((stage) => stage.status === 'current').length, 1);
  assert.match(journey.personalized_notes[0], /Dị ứng đạm sữa bò/);
  assert.match(journey.next_milestone, /6–12 tháng/);
});

test('nhắc mua lại: lon 800g (14 ngày) hoàn thành 12 ngày trước còn 2 ngày thì nhắc', () => {
  const purchases = [
    { product_id: 1, ordered_at: '2026-10-29 10:00:00', order_status: 'COMPLETED', completed_at: '2026-10-31', usage_days: 14, quantity: 1 },
    { product_id: 2, ordered_at: '2026-11-05 10:00:00', order_status: 'COMPLETED', completed_at: '2026-11-07', usage_days: 14, quantity: 1 },
    { product_id: 3, ordered_at: '2026-10-01 10:00:00', order_status: 'COMPLETED', completed_at: '2026-10-03', usage_days: 14, quantity: 1 },
    { product_id: 4, ordered_at: '2026-10-29 10:00:00', order_status: 'COMPLETED', completed_at: '2026-10-31', usage_days: 14, quantity: 1 },
    { product_id: 4, ordered_at: '2026-11-11 10:00:00', order_status: 'SHIPPING', completed_at: null, usage_days: 14, quantity: 1 }
  ];
  const due = replenishmentDue(purchases, today);
  assert.deepEqual(due.map((d) => [d.product_id, d.days_left, d.run_out_date]), [[1, 2, '2026-11-14']]);
  // sữa chua dùng 2 ngày/lốc, hết từ 8 ngày trước: không nhắc nữa
  assert.equal(replenishmentDue([{ product_id: 9, ordered_at: '2026-10-29', order_status: 'COMPLETED', completed_at: '2026-11-02', usage_days: 2, quantity: 1 }], today).length, 0);
  // mua 2 lon thì dùng gấp đôi thời gian
  assert.equal(replenishmentDue([{ ...purchases[0], quantity: 2 }], today).length, 0);
});
