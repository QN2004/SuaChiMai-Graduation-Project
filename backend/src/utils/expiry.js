// Quy tắc lô – hạn sử dụng (FEFO).
// vòng đời = HSD - NSX; % còn lại = (HSD - hôm nay) / vòng đời.
// Hạn tối thiểu khi bán = thời gian dùng hết sản phẩm + thời gian giao dự kiến:
// lô còn ít hạn hơn mức này thì khách không kịp dùng hết, nên ngừng bán online.

// Đọc khi dùng (getter) để .env nạp sau lúc import vẫn có hiệu lực.
export const EXPIRY_CONFIG = {
  get nearExpiryPercent() { return Number(process.env.NEAR_EXPIRY_PERCENT) || 15; },
  get deliveryDays() { return Number(process.env.DELIVERY_DAYS) || 7; }
};

export const BATCH_STATUS = {
  NORMAL: 'NORMAL',
  NEAR_EXPIRY: 'NEAR_EXPIRY',
  BLOCKED: 'BLOCKED',
  EXPIRED: 'EXPIRED'
};

const DAY_MS = 86400000;
const toDayNumber = (value) => {
  const [y, m, d] = String(value).slice(0, 10).split('-').map(Number);
  return Date.UTC(y, m - 1, d) / DAY_MS;
};

export const todayVN = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());

// Mức gợi ý giảm theo % vòng đời còn lại; 9% và 4% tỷ lệ với ngưỡng 15%.
export const discountTiers = (nearExpiryPercent) => [
  { maxPercent: Math.round(nearExpiryPercent * 0.27), discount: 30 },
  { maxPercent: Math.round(nearExpiryPercent * 0.6), discount: 20 },
  { maxPercent: nearExpiryPercent, discount: 10 }
];

export const classifyBatch = (batch, usageDays, today = todayVN(), config = EXPIRY_CONFIG) => {
  const lifeDays = toDayNumber(batch.expiry_date) - toDayNumber(batch.manufactured_date);
  const remainingDays = toDayNumber(batch.expiry_date) - toDayNumber(today);
  const remainingPercent = lifeDays > 0 ? Math.round((remainingDays / lifeDays) * 1000) / 10 : 0;
  const minDays = (Number(usageDays) || 0) + config.deliveryDays;
  const result = { remainingDays, remainingPercent, minDays, suggestedDiscount: null };

  if (remainingDays < 0) return { ...result, status: BATCH_STATUS.EXPIRED, sellable: false };
  if (remainingDays < minDays) return { ...result, status: BATCH_STATUS.BLOCKED, sellable: false };
  const tier = discountTiers(config.nearExpiryPercent).find((item) => remainingPercent <= item.maxPercent);
  if (tier) return { ...result, status: BATCH_STATUS.NEAR_EXPIRY, sellable: true, suggestedDiscount: tier.discount };
  return { ...result, status: BATCH_STATUS.NORMAL, sellable: true };
};

export const batchPrice = (basePrice, discountPercent) =>
  discountPercent ? Math.round((Number(basePrice) * (100 - Number(discountPercent))) / 100) : Number(basePrice);

// Giảm giá xả hàng chỉ có hiệu lực khi lô đang cận date.
export const effectiveDiscount = (batch, classification) =>
  classification.status === BATCH_STATUS.NEAR_EXPIRY && batch.discount_percent ? Number(batch.discount_percent) : null;

const byFefo = (a, b) => String(a.expiry_date).localeCompare(String(b.expiry_date)) || a.id - b.id;

// Lấy qty từ các lô (đã lọc còn bán được) theo HSD gần nhất trước. Không đủ hàng -> null.
export const allocateFEFO = (batches, qty) => {
  const parts = [];
  let need = qty;
  for (const batch of [...batches].sort(byFefo)) {
    if (need <= 0) break;
    const take = Math.min(Number(batch.remaining), need);
    if (take > 0) {
      parts.push({ batch, quantity: take });
      need -= take;
    }
  }
  return need > 0 ? null : parts;
};

export const formatDateVN = (value) => String(value).slice(0, 10).split('-').reverse().join('/');

// Chia một sản phẩm thành các dòng đơn theo giá: mỗi lô đang giảm giá là một dòng
// (tên kèm HSD), các lô giá thường gộp chung một dòng.
export const buildOrderLines = (product, batches, qty, today = todayVN(), config = EXPIRY_CONFIG) => {
  const sellable = batches
    .map((batch) => ({ batch, info: classifyBatch(batch, product.usage_days, today, config) }))
    .filter((item) => item.info.sellable);
  const parts = allocateFEFO(sellable.map((item) => item.batch), qty);
  if (!parts) {
    const available = sellable.reduce((sum, item) => sum + Number(item.batch.remaining), 0);
    return { lines: null, available };
  }
  const infoById = new Map(sellable.map((item) => [item.batch.id, item.info]));
  const basePrice = Number(product.sale_price || product.price);
  const lines = [];
  let normalLine = null;
  for (const part of parts) {
    const discount = effectiveDiscount(part.batch, infoById.get(part.batch.id));
    if (discount) {
      const unitPrice = batchPrice(basePrice, discount);
      lines.push({
        product_id: product.id,
        product_name: `${product.name} (cận date, HSD ${formatDateVN(part.batch.expiry_date)})`,
        unit_price: unitPrice,
        quantity: part.quantity,
        total_price: unitPrice * part.quantity,
        discount_percent: discount,
        expiry_date: part.batch.expiry_date,
        parts: [part]
      });
    } else {
      if (!normalLine) {
        normalLine = {
          product_id: product.id,
          product_name: product.name,
          unit_price: basePrice,
          quantity: 0,
          total_price: 0,
          discount_percent: null,
          expiry_date: part.batch.expiry_date,
          parts: []
        };
        lines.push(normalLine);
      }
      normalLine.quantity += part.quantity;
      normalLine.total_price = basePrice * normalLine.quantity;
      normalLine.parts.push(part);
    }
  }
  return { lines, available: null };
};
