import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

// Giá tạm tính theo FEFO từ máy chủ: lô cận date đang giảm giá được tách dòng riêng.
// Lỗi mạng thì dùng giá niêm yết; giá cuối cùng vẫn do máy chủ tính khi đặt hàng.
export const usePricePreview = (items) => {
  const [preview, setPreview] = useState(null);
  const key = items.map((item) => `${item.id}:${item.quantity}`).join(',');

  useEffect(() => {
    if (!items.length) {
      setPreview(null);
      return undefined;
    }
    let active = true;
    const timer = setTimeout(() => {
      api.post('/orders/preview', { items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })) })
        .then((res) => { if (active) setPreview(res.data); })
        .catch(() => { if (active) setPreview(null); });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return useMemo(() => {
    const fallback = (item) => [{
      product_id: item.id,
      product_name: item.name,
      unit_price: Number(item.sale_price || item.price || 0),
      quantity: item.quantity,
      total_price: Number(item.sale_price || item.price || 0) * item.quantity,
      discount_percent: null
    }];
    const linesFor = (item) => {
      const lines = preview?.lines.filter((line) => line.product_id === item.id) || [];
      return lines.length ? lines : fallback(item);
    };
    const total = items.reduce((sum, item) => sum + linesFor(item).reduce((s, line) => s + line.total_price, 0), 0);
    return { linesFor, total, problems: preview?.problems || [] };
  }, [items, preview]);
};
