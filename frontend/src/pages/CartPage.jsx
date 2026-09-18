import { Link } from 'react-router-dom';
import { imageUrl } from '../api/client';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  if (!items.length) return <section className="section empty"><h2>Giỏ hàng đang trống</h2><Link className="btn primary" to="/products">Tiếp tục mua sắm</Link></section>;
  return (
    <section className="section">
      <div className="section-title"><h2>Giỏ hàng</h2><Link to="/products">Mua thêm</Link></div>
      <div className="cart-layout">
        <div className="cart-list">{items.map((item) => <div className="cart-item" key={item.id}><img src={imageUrl(item.image)} /><div><strong>{item.name}</strong><span>{money(item.sale_price || item.price)}</span></div><input type="number" min="1" max={item.stock} value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} /><b>{money((item.sale_price || item.price) * item.quantity)}</b><button onClick={() => removeItem(item.id)}>Xóa</button></div>)}</div>
        <aside className="summary"><h3>Tổng thanh toán</h3><strong>{money(total)}</strong><Link className="btn primary full" to="/checkout">Thanh toán</Link></aside>
      </div>
    </section>
  );
}
