import { Link } from 'react-router-dom';
import { imageUrl } from '../api/client';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';
import { formatDate } from '../utils/expiry';

const leftText = (days) => (days > 0 ? `Còn khoảng ${days} ngày` : days === 0 ? 'Dự kiến hết hôm nay' : `Đã hết khoảng ${-days} ngày`);

// Thẻ sản phẩm sắp hết theo đơn đã hoàn thành, thanh tiến độ = phần đã dùng, kèm nút đặt lại.
export default function ReplenishmentList({ items }) {
  const { addToCart } = useCart();
  return (
    <div className="replenish-grid">
      {items.map((item) => {
        const cover = Number(item.usage_days) * Number(item.quantity) || 1;
        const used = Math.min(100, Math.max(0, Math.round(((cover - item.days_left) / cover) * 100)));
        return (
          <article className="replenish-card" key={item.product_id}>
            <img src={imageUrl(item.image)} alt="" />
            <div>
              <Link className="name" to={`/products/${item.slug}`}>{item.name}</Link>
              <div className="meta">Mua {item.quantity} ngày {formatDate(item.completed_at)} · dùng ~{cover} ngày</div>
              <span className={`tone-chip ${item.days_left <= 0 ? 'bad' : 'warn'}`}>{leftText(item.days_left)}</span>
            </div>
            <div className="replenish-progress" title={`Đã dùng khoảng ${used}%`}><span style={{ width: `${used}%` }} /></div>
            <div className="bottom">
              <strong>{money(item.sale_price || item.price)}</strong>
              <button type="button" className="btn primary small" disabled={Number(item.stock) <= 0} onClick={() => addToCart(item, Number(item.quantity) || 1)}>
                {Number(item.stock) > 0 ? 'Đặt lại' : 'Hết hàng'}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
