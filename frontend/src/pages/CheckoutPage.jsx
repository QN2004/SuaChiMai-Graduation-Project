import { useEffect, useMemo, useState } from 'react';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaQrcode,
  FaShieldAlt,
  FaStickyNote,
  FaTruck,
  FaUser
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { imageUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { money, paymentText } from '../utils/format';
import { qrPaymentUrl, storePayment } from '../utils/payment';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const directPurchase = location.state?.buyNow;
  const isBuyNow = Boolean(directPurchase?.product?.id);

  const checkoutItems = useMemo(() => {
    if (!isBuyNow) return items;
    const product = directPurchase.product;
    const stock = Math.max(1, Number(product.stock) || 1);
    const quantity = Math.max(1, Math.min(stock, Math.trunc(Number(directPurchase.quantity)) || 1));
    return [{ ...product, quantity }];
  }, [directPurchase, isBuyNow, items]);

  const checkoutTotal = useMemo(() => checkoutItems.reduce(
    (sum, item) => sum + Number(item.sale_price || item.price || 0) * item.quantity,
    0
  ), [checkoutItems]);

  const totalQuantity = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  const returnPath = isBuyNow ? `/products/${directPurchase.product.slug}` : '/cart';
  const [form, setForm] = useState({
    customer_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
    payment_method: 'COD'
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (!user || edited) return;
    setForm((current) => ({
      ...current,
      customer_name: current.customer_name || user.full_name || '',
      phone: current.phone || user.phone || '',
      address: current.address || user.address || ''
    }));
  }, [user, edited]);

  const updateField = (key, value) => {
    setEdited(true);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting || !checkoutItems.length) return;
    setSubmitting(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        items: checkoutItems.map((item) => ({ product_id: item.id, quantity: item.quantity }))
      };
      const res = await api.post('/orders', payload);
      if (!isBuyNow) clearCart();
      navigate(`/my-orders/${res.data.id}`, { replace: true });
    } catch (err) {
      setMessage(err.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  if (!checkoutItems.length) {
    return (
      <main className="checkout-page checkout-page-v2">
        <section className="checkout-shell checkout-empty">
          <span className="section-kicker">Thanh toán</span>
          <h1>Chưa có sản phẩm để thanh toán</h1>
          <p>Quay lại cửa hàng để chọn sản phẩm phù hợp với nhu cầu của bạn.</p>
          <Link className="btn primary" to="/products">Khám phá sản phẩm</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page checkout-page-v2">
      <div className="checkout-shell">
        <Link className="checkout-back" to={returnPath}><FaArrowLeft /> Quay lại {isBuyNow ? 'sản phẩm' : 'giỏ hàng'}</Link>

        <header className="checkout-header">
          <div>
            <span className="section-kicker">Thanh toán an toàn</span>
            <h1>Hoàn tất đơn hàng</h1>
            <p>Kiểm tra sản phẩm, thông tin nhận hàng và phương thức thanh toán.</p>
          </div>
          <span className="checkout-mode-badge">{isBuyNow ? 'Mua ngay' : 'Từ giỏ hàng'}</span>
        </header>

        <form className="checkout-layout-v2" onSubmit={submit}>
          <div className="checkout-main-column">
            {message && <div className="alert">{message}</div>}

            <section className="checkout-panel checkout-recipient-panel">
              <div className="checkout-panel-heading">
                <span>1</span>
                <div><h2>Thông tin nhận hàng</h2><p>Thông tin dùng để cửa hàng liên hệ và giao sản phẩm.</p></div>
              </div>

              <div className="checkout-fields">
                <label className="checkout-field">
                  <span>Họ tên người nhận</span>
                  <div><FaUser /><input required autoComplete="name" placeholder="Nhập họ tên" value={form.customer_name} onChange={(event) => updateField('customer_name', event.target.value)} /></div>
                </label>
                <label className="checkout-field">
                  <span>Số điện thoại</span>
                  <div><FaPhoneAlt /><input required inputMode="tel" autoComplete="tel" placeholder="Nhập số điện thoại" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} /></div>
                </label>
                <label className="checkout-field checkout-field-wide">
                  <span>Địa chỉ giao hàng</span>
                  <div><FaMapMarkerAlt /><input required autoComplete="street-address" placeholder="Số nhà, đường, xã/phường..." value={form.address} onChange={(event) => updateField('address', event.target.value)} /></div>
                </label>
                <label className="checkout-field checkout-field-wide">
                  <span>Ghi chú <small>(không bắt buộc)</small></span>
                  <div className="checkout-note-field"><FaStickyNote /><textarea placeholder="Ví dụ: gọi trước khi giao hàng" value={form.note} onChange={(event) => updateField('note', event.target.value)} /></div>
                </label>
              </div>
            </section>

            <section className="checkout-panel checkout-payment-panel">
              <div className="checkout-panel-heading">
                <span>2</span>
                <div><h2>Phương thức thanh toán</h2><p>Chọn cách thanh toán thuận tiện nhất cho bạn.</p></div>
              </div>

              <div className="payment-options checkout-payment-options">
                <label className={form.payment_method === 'COD' ? 'active' : ''}>
                  <input type="radio" name="payment_method" value="COD" checked={form.payment_method === 'COD'} onChange={(event) => updateField('payment_method', event.target.value)} />
                  <span className="checkout-payment-icon"><FaTruck /></span>
                  <span><strong>{paymentText.COD}</strong><small>Thanh toán khi nhận sản phẩm</small></span>
                </label>
                <label className={form.payment_method === 'BANK_TRANSFER' ? 'active' : ''}>
                  <input type="radio" name="payment_method" value="BANK_TRANSFER" checked={form.payment_method === 'BANK_TRANSFER'} onChange={(event) => updateField('payment_method', event.target.value)} />
                  <span className="checkout-payment-icon"><FaQrcode /></span>
                  <span><strong>{paymentText.BANK_TRANSFER}</strong><small>Quét mã VietQR nhanh chóng</small></span>
                </label>
              </div>

              {form.payment_method === 'BANK_TRANSFER' && (
                <div className="qr-card checkout-qr-card">
                  <div className="qr-visual">
                    <span>VietQR</span>
                    <img src={qrPaymentUrl({ amount: checkoutTotal, orderNumber: `SUACHIMAI ${form.phone || ''}` })} alt="QR chuyển khoản" />
                  </div>
                  <div className="qr-info">
                    <span className="section-kicker">Thanh toán QR</span>
                    <h3>Quét mã để chuyển khoản</h3>
                    <p>Mã QR đã điền sẵn số tiền và nội dung thanh toán.</p>
                    <div className="qr-payment-lines">
                      <span>Ngân hàng</span><strong>MB Bank</strong>
                      <span>Số tài khoản</span><strong>{storePayment.accountNo}</strong>
                      <span>Chủ tài khoản</span><strong>{storePayment.accountName}</strong>
                      <span>Số tiền</span><strong className="qr-amount">{money(checkoutTotal)}</strong>
                      <span>Nội dung</span><strong>SUACHIMAI {form.phone || 'SDT'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="checkout-order-card">
            <div className="checkout-order-heading">
              <div><h2>Đơn hàng</h2><span>{totalQuantity} sản phẩm</span></div>
              <Link to={returnPath}>Chỉnh sửa</Link>
            </div>

            <div className="checkout-order-items">
              {checkoutItems.map((item) => (
                <article className="checkout-order-item" key={item.id}>
                  <div className="checkout-order-image">
                    <img src={imageUrl(item.image)} alt={item.name} />
                    <span>{item.quantity}</span>
                  </div>
                  <div><strong>{item.name}</strong><span>{money(item.sale_price || item.price)} × {item.quantity}</span></div>
                  <b>{money(Number(item.sale_price || item.price) * item.quantity)}</b>
                </article>
              ))}
            </div>

            <div className="checkout-totals">
              <p><span>Tạm tính</span><strong>{money(checkoutTotal)}</strong></p>
              <p><span>Phí giao hàng</span><em>Xác nhận sau</em></p>
              <div><span>Tổng cộng</span><strong>{money(checkoutTotal)}</strong></div>
            </div>

            <button className="btn primary full checkout-submit-btn" disabled={submitting}>
              <FaMoneyBillWave /> {submitting ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
            </button>
            <p className="checkout-secure-note"><FaShieldAlt /> Thông tin đơn hàng được bảo mật</p>
          </aside>
        </form>
      </div>
    </main>
  );
}
