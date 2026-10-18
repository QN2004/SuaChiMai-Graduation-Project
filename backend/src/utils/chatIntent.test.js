import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getProductIdsFromAnswer,
  getOrderIdsFromAnswer,
  getRequestedOrderStatuses,
  getRequestedPaymentStatuses,
  isComparisonRequest,
  isOrderRequest,
  isProductRequest,
  selectOrdersByIds,
  stripOrderMetadata,
  stripProductMetadata
} from './chatIntent.js';

test('recognizes Vietnamese comparison requests with or without diacritics', () => {
  const requests = [
    'So sánh 3 sản phẩm sữa hạt',
    'so sanh cac loai nay',
    'Ba sản phẩm này khác gì nhau?',
    'Đặt hai hộp sữa cạnh nhau giúp tôi',
    'Compare Vinamilk vs Meiji'
  ];

  requests.forEach((request) => assert.equal(isComparisonRequest(request), true, request));
});

test('does not mark a normal product lookup as a comparison', () => {
  assert.equal(isComparisonRequest('Tìm sữa cho bé 2 tuổi'), false);
  assert.equal(isProductRequest('Tim sua cho be 2 tuoi'), true);
});

test('separates confirmed orders from orders waiting for confirmation', () => {
  assert.deepEqual(getRequestedOrderStatuses('đơn hàng đã xác nhận của tôi'), ['CONFIRMED']);
  assert.deepEqual(getRequestedOrderStatuses('don hang da xac nhan cua toi'), ['CONFIRMED']);
  assert.deepEqual(getRequestedOrderStatuses('đơn hàng chờ xác nhận'), ['PENDING']);
});

test('recognizes and filters paid and unpaid order requests', () => {
  assert.equal(isOrderRequest('các đơn chưa thanh toán của tôi'), true);
  assert.equal(isOrderRequest('cac don chua thanh toan cua toi'), true);
  assert.deepEqual(getRequestedPaymentStatuses('các đơn chưa thanh toán của tôi'), ['UNPAID']);
  assert.deepEqual(getRequestedPaymentStatuses('đơn hàng đã thanh toán'), ['PAID']);
});

test('extracts product ids from hidden assistant metadata without exposing it to customers', () => {
  const answer = '[[PRODUCT_IDS: 12, 7, 12, invalid, 0]]\n🥛 Mình đã tìm thấy một số sản phẩm phù hợp.';

  assert.deepEqual(getProductIdsFromAnswer(answer), [12, 7]);
  assert.equal(
    stripProductMetadata(answer),
    '🥛 Mình đã tìm thấy một số sản phẩm phù hợp.'
  );
});

test('selects order API results using Dify metadata order', () => {
  const answer = `[[ORDER_IDS: 9, 7]]
✅ Tìm thấy 2 đơn hàng chưa thanh toán của bạn.`;
  const orders = [
    { id: 7, order_number: 'CM007' },
    { id: 8, order_number: 'CM008' },
    { id: 9, order_number: 'CM009' }
  ];

  assert.deepEqual(getOrderIdsFromAnswer(answer), [9, 7]);
  assert.deepEqual(
    selectOrdersByIds(orders, getOrderIdsFromAnswer(answer)).map((order) => order.id),
    [9, 7]
  );
  assert.equal(
    stripOrderMetadata(answer),
    '✅ Tìm thấy 2 đơn hàng chưa thanh toán của bạn.'
  );
});
