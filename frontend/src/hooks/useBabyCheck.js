import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

// Cảnh báo an toàn theo hồ sơ bé đang chọn cho danh sách sản phẩm (giỏ hàng, đặt hàng, trang chi tiết).
export const useBabyCheck = (productIds) => {
  const { user } = useAuth();
  const [result, setResult] = useState({ baby: null, warnings: [] });
  const key = [...new Set(productIds)].sort().join(',');

  useEffect(() => {
    if (!user || user.role === 'admin' || !key) {
      setResult({ baby: null, warnings: [] });
      return undefined;
    }
    let active = true;
    api.post('/babies/check-cart', { items: key.split(',').map((id) => ({ product_id: Number(id) })) })
      .then((res) => { if (active) setResult(res.data); })
      .catch(() => { if (active) setResult({ baby: null, warnings: [] }); });
    return () => { active = false; };
  }, [user, key]);

  return result;
};
