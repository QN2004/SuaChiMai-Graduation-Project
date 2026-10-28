import { Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaLock,
  FaShoppingBasket,
  FaTrashAlt
} from 'react-icons/fa';
import { imageUrl } from '../api/client';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, count } = useCart();

  if (!items.length) {
    return (
      <main className="cart-page">
        <section className="cart-shell cart-empty-state">
          <span className="cart-empty-icon"><FaShoppingBasket /></span>
          <span className="cart-eyebrow">Giỏ hàng của bạn</span>
          <h1>Chưa có sản phẩm trong giỏ</h1>
          <p>Khám phá các sản phẩm dinh dưỡng phù hợp cho bé, mẹ và cả gia đình.</p>
          <Link className="btn primary cart-empty-cta" to="/products">
            Khám phá sản phẩm
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-shell">
        <header className="cart-page-header">
          <div>
            <span className="cart-eyebrow">Đơn hàng của bạn</span>
            <h1>Giỏ hàng</h1>
            <p>{count} sản phẩm đã sẵn sàng để thanh toán</p>
          </div>
          <Link className="cart-continue-link" to="/products">
            <FaArrowLeft /> Tiếp tục mua sắm
          </Link>
        </header>

        <div className="cart-layout cart-layout-v2">
          <div className="cart-products-card">
            <div className="cart-list-heading">
              <strong>Sản phẩm</strong>
              <span>{items.length} mặt hàng</span>
            </div>

            <div className="cart-list cart-list-v2">
              {items.map((item) => {
                const unitPrice = Number(item.sale_price || item.price || 0);
                const stock = Math.max(1, Number(item.stock) || 1);

                return (
                  <article className="cart-item cart-item-v2" key={item.id}>
                    <Link className="cart-item-image" to={`/products/${item.slug}`}>
                      <img src={imageUrl(item.image)} alt={item.name} loading="lazy" />
                    </Link>

                    <div className="cart-item-info">
                      <span className="cart-item-brand">{item.brand_name || 'Sữa Chi Mai'}</span>
                      <Link to={`/products/${item.slug}`} className="cart-item-name">{item.name}</Link>
                      <span className="cart-item-unit-price">{money(unitPrice)} / sản phẩm</span>
                    </div>

                    <div className="cart-quantity" aria-label={`Số lượng ${item.name}`}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max={stock}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.id, event.target.value)}
                        aria-label={`Nhập số lượng ${item.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= stock}
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    <strong className="cart-item-total">{money(unitPrice * item.quantity)}</strong>
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                    >
                      <FaTrashAlt />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="cart-summary-card">
            <div className="cart-summary-heading">
              <span>Tóm tắt đơn hàng</span>
              <small>{count} sản phẩm</small>
            </div>
            <div className="cart-summary-row">
              <span>Tạm tính</span>
              <strong>{money(total)}</strong>
            </div>
            <div className="cart-summary-row">
              <span>Phí giao hàng</span>
              <em>Tính khi xác nhận</em>
            </div>
            <div className="cart-summary-total">
              <span>Tổng cộng</span>
              <strong>{money(total)}</strong>
            </div>
            <Link className="btn primary full cart-checkout-btn" to="/checkout">
              Tiến hành thanh toán
            </Link>
            <p className="cart-secure-note"><FaLock /> Thông tin đặt hàng được bảo mật</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
