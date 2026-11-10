import test from 'node:test';
import assert from 'node:assert/strict';
import { allocateFEFO, batchPrice, buildOrderLines, classifyBatch } from './expiry.js';

const config = { nearExpiryPercent: 15, deliveryDays: 7 };
const today = '2026-11-12';
// Vòng đời 1000 ngày để % còn lại dễ đọc: còn N ngày = N/10 %.
const lot = (id, daysLeft, remaining = 10, discount = null) => {
  const exp = new Date(Date.UTC(2026, 10, 12 + daysLeft)).toISOString().slice(0, 10);
  const mfg = new Date(Date.UTC(2026, 10, 12 + daysLeft - 1000)).toISOString().slice(0, 10);
  return { id, manufactured_date: mfg, expiry_date: exp, remaining, discount_percent: discount };
};

test('phân loại lô theo % vòng đời còn lại', () => {
  assert.equal(classifyBatch(lot(1, 151), 14, today, config).status, 'NORMAL');
  const near10 = classifyBatch(lot(1, 150), 14, today, config);
  assert.deepEqual([near10.status, near10.suggestedDiscount], ['NEAR_EXPIRY', 10]);
  assert.equal(classifyBatch(lot(1, 90), 14, today, config).suggestedDiscount, 20);
  assert.equal(classifyBatch(lot(1, 91), 14, today, config).suggestedDiscount, 10);
  assert.equal(classifyBatch(lot(1, 40), 14, today, config).suggestedDiscount, 30);
  assert.equal(classifyBatch(lot(1, 41), 14, today, config).suggestedDiscount, 20);
});

test('lô không đủ hạn tối thiểu (dùng hết + giao) thì ngừng bán', () => {
  // dùng 14 ngày + giao 7 ngày = 21 ngày
  assert.equal(classifyBatch(lot(1, 21), 14, today, config).status, 'NEAR_EXPIRY');
  const blocked = classifyBatch(lot(1, 20), 14, today, config);
  assert.deepEqual([blocked.status, blocked.sellable], ['BLOCKED', false]);
  // hạn tối thiểu xét trước cả khi % còn lại cao (vòng đời ngắn)
  const shortLife = { id: 1, manufactured_date: '2026-11-01', expiry_date: '2026-11-20', remaining: 5 };
  assert.equal(classifyBatch(shortLife, 3, today, config).status, 'BLOCKED');
});

test('lô quá HSD là hết hạn; đúng ngày HSD chưa tính hết hạn', () => {
  assert.equal(classifyBatch(lot(1, -1), 0, today, { ...config, deliveryDays: 0 }).status, 'EXPIRED');
  assert.equal(classifyBatch(lot(1, 0), 0, today, { ...config, deliveryDays: 0 }).status, 'NEAR_EXPIRY');
});

test('allocateFEFO lấy lô hết hạn sớm trước, vượt sang lô sau, thiếu thì null', () => {
  const late = lot(2, 400, 10);
  const early = lot(1, 100, 3);
  const parts = allocateFEFO([late, early], 5);
  assert.deepEqual(parts.map((p) => [p.batch.id, p.quantity]), [[1, 3], [2, 2]]);
  assert.equal(allocateFEFO([late, early], 14), null);
});

test('batchPrice làm tròn đến đồng', () => {
  assert.equal(batchPrice(255000, 20), 204000);
  assert.equal(batchPrice(62900, 15), 53465);
  assert.equal(batchPrice(62900, null), 62900);
});

test('buildOrderLines tách dòng giá giảm của lô cận date và dòng giá thường', () => {
  const product = { id: 7, name: 'Sữa X', price: 300000, sale_price: 250000, usage_days: 14 };
  const batches = [lot(1, 60, 2, 20), lot(2, 400, 10), lot(3, 10, 5)];
  const { lines } = buildOrderLines(product, batches, 5, today, config);
  assert.equal(lines.length, 2);
  assert.equal(lines[0].product_name, 'Sữa X (cận date, HSD 11/01/2027)');
  assert.deepEqual([lines[0].unit_price, lines[0].quantity], [200000, 2]);
  assert.deepEqual([lines[1].unit_price, lines[1].quantity, lines[1].total_price], [250000, 3, 750000]);
});

test('giảm giá đã duyệt không áp dụng khi lô không còn cận date; thiếu hàng báo số còn bán', () => {
  const product = { id: 7, name: 'Sữa X', price: 100000, sale_price: null, usage_days: 14 };
  const { lines } = buildOrderLines(product, [lot(1, 400, 5, 30)], 2, today, config);
  assert.equal(lines[0].unit_price, 100000);
  const short = buildOrderLines(product, [lot(1, 400, 5), lot(2, 10, 9)], 8, today, config);
  assert.deepEqual([short.lines, short.available], [null, 5]);
});
