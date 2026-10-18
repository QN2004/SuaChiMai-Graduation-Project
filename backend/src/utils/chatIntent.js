export const normalizeChatText = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/đ/g, 'd')
  .replace(/\s+/g, ' ')
  .trim();

const PRODUCT_INTENT = /(san pham|sua|gia|gia tien|mua|tu van|so sanh|dinh duong|cho be|me bau)/i;
const ORDER_INTENT = /(don hang|don.{0,60}cua toi|ma don|giao hang|dang giao|da giao|da xu ly|da huy|cho xac nhan|chua thanh toan|da thanh toan)/i;
const COMPARE_INTENT = /(so sanh|khac nhau|khac gi|khac biet|nao tot hon|nen chon|doi chieu|dat .{0,80} canh nhau|compare|versus|\bvs\b)/i;

export const isProductRequest = (...values) => PRODUCT_INTENT.test(normalizeChatText(values.join(' ')));
export const isOrderRequest = (value) => ORDER_INTENT.test(normalizeChatText(value));
export const isComparisonRequest = (value) => COMPARE_INTENT.test(normalizeChatText(value));

export const getProductIdsFromAnswer = (value) => {
  const match = String(value || '').match(/\[\[PRODUCT_IDS:\s*([^\]]*)\]\]/i);
  if (!match) return [];

  return [...new Set(match[1]
    .split(',')
    .map((id) => Number.parseInt(id.trim(), 10))
    .filter((id) => Number.isSafeInteger(id) && id > 0))]
    .slice(0, 20);
};

export const stripProductMetadata = (value) => String(value || '')
  .replace(/\s*\[\[PRODUCT_IDS:\s*[^\]]*\]\]\s*/gi, ' ')
  .trim();

export const getOrderIdsFromAnswer = (value) => {
  const match = String(value || '').match(/\[\[ORDER_IDS:\s*([^\]]*)\]\]/i);
  if (!match) return [];

  return [...new Set(match[1]
    .split(',')
    .map((id) => Number.parseInt(id.trim(), 10))
    .filter((id) => Number.isSafeInteger(id) && id > 0))]
    .slice(0, 20);
};

export const stripOrderMetadata = (value) => String(value || '')
  .replace(/\s*\[\[ORDER_IDS:\s*[^\]]*\]\]\s*/gi, ' ')
  .trim();

export const getRequestedOrderStatuses = (value) => {
  const text = normalizeChatText(value);
  if (/(hoan thanh|da giao|da xu ly)/i.test(text)) return ['COMPLETED'];
  if (/dang giao/i.test(text)) return ['SHIPPING'];
  if (/(da huy|huy)/i.test(text)) return ['CANCELLED'];
  if (/da xac nhan/i.test(text)) return ['CONFIRMED'];
  if (/(cho xac nhan|dang cho|cho duyet)/i.test(text)) return ['PENDING'];
  return [];
};

export const getRequestedPaymentStatuses = (value) => {
  const text = normalizeChatText(value);
  if (/(chua thanh toan|chua tra tien)/i.test(text)) return ['UNPAID'];
  if (/(da thanh toan|da tra tien)/i.test(text)) return ['PAID'];
  return [];
};

export const selectOrdersByIds = (orders, requestedIds) => {
  if (!Array.isArray(orders) || !requestedIds.length) return [];

  const ordersById = new Map(orders.map((order) => [Number(order.id), order]));
  return requestedIds
    .map((id) => ordersById.get(id))
    .filter(Boolean)
    .slice(0, 8);
};
