import { pool } from '../config/db.js';
import { BATCH_STATUS, EXPIRY_CONFIG, batchPrice, classifyBatch, effectiveDiscount, todayVN } from '../utils/expiry.js';

// products.stock = tổng remaining của các lô còn đủ hạn tối thiểu (usage_days + thời gian giao).
export const syncProductStock = async (conn, productIds = null) => {
  const ids = productIds ? [...new Set(productIds.filter(Boolean))] : null;
  if (ids && !ids.length) return;
  await conn.execute(
    `UPDATE products p SET stock = (
       SELECT COALESCE(SUM(b.remaining), 0) FROM product_batches b
       WHERE b.product_id = p.id AND DATEDIFF(b.expiry_date, ?) >= p.usage_days + ?
     )${ids ? ` WHERE p.id IN (${ids.map(() => '?').join(',')})` : ''}`,
    [todayVN(), EXPIRY_CONFIG.deliveryDays, ...(ids || [])]
  );
};

// Lô vừa quá hạn tối thiểu theo ngày phải tự rời khỏi tồn bán được: đồng bộ khi khởi động và mỗi giờ.
export const startStockSync = () => {
  const run = () => syncProductStock(pool).catch((err) => console.error('[stock-sync]', err.message));
  run();
  return setInterval(run, 60 * 60 * 1000);
};

// Các lô đang bán của nhiều sản phẩm, theo FEFO, kèm giá sau giảm.
// Lý do sản phẩm không bán được trên web dù kho còn hàng: BLOCKED (HSD ngắn) hoặc EXPIRED; null nếu không.
export const offlineReason = (product, locked) => {
  if (Number(product.stock) > 0 || !locked) return null;
  if (locked.BLOCKED > 0) return 'BLOCKED';
  if (locked.EXPIRED > 0) return 'EXPIRED';
  return null;
};

export const getBatchesOnSale = async (products) => {
  if (!products.length) return new Map();
  const ids = products.map((p) => p.id);
  const [rows] = await pool.query(
    `SELECT id, product_id, lot_number, manufactured_date, expiry_date, remaining, discount_percent
     FROM product_batches WHERE remaining > 0 AND product_id IN (?) ORDER BY expiry_date, id`,
    [ids]
  );
  const today = todayVN();
  const byProduct = new Map(products.map((p) => [p.id, []]));
  const productById = new Map(products.map((p) => [p.id, p]));
  // Hàng còn trong kho nhưng bị khóa (không đủ hạn tối thiểu / đã hết hạn), để web phân biệt với hết hàng thật.
  const lockedStock = new Map();
  for (const batch of rows) {
    const product = productById.get(batch.product_id);
    const info = classifyBatch(batch, product.usage_days, today);
    if (!info.sellable) {
      const locked = lockedStock.get(batch.product_id) || { BLOCKED: 0, EXPIRED: 0 };
      locked[info.status] += Number(batch.remaining);
      lockedStock.set(batch.product_id, locked);
      continue;
    }
    const discount = effectiveDiscount(batch, info);
    // Không trả số lô / id lô ra API công khai: khách chỉ cần HSD và giá.
    byProduct.get(batch.product_id).push({
      expiry_date: batch.expiry_date,
      remaining: batch.remaining,
      status: info.status,
      discount_percent: discount,
      unit_price: batchPrice(product.sale_price || product.price, discount)
    });
  }
  for (const product of products) {
    product.offline_reason = offlineReason(product, lockedStock.get(product.id));
  }
  return byProduct;
};

// Gắn thông tin lô FEFO đầu tiên cho danh sách sản phẩm (nhãn "Cận date -X%" và HSD trên thẻ).
export const attachExpiryInfo = async (products) => {
  const batches = await getBatchesOnSale(products);
  for (const product of products) {
    const first = batches.get(product.id)?.[0];
    product.next_expiry_date = first?.expiry_date || null;
    product.near_expiry = first?.status === BATCH_STATUS.NEAR_EXPIRY;
    product.near_expiry_discount = first?.discount_percent || null;
  }
  return products;
};
