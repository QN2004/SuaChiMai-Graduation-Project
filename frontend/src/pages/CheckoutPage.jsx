import { useState } from 'react';
import { FaMoneyBillWave, FaQrcode, FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { money, paymentText } from '../utils/format';
import { qrPaymentUrl, storePayment } from '../utils/payment';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
    payment_method: 'COD'
  });
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })) };
      const res = await api.post('/orders', payload);
      clearCart();
      navigate(`/my-orders/${res.data.id}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="section checkout-page">
      <div className="section-title">
        <div>
          <span className="section-kicker">Thanh toán</span>
          <h2>Hoàn tất đơn hàng</h2>
          <p>Kiểm tra thông tin nhận hàng và chọn phương thức thanh toán phù hợp.</p>
        </div>
        <span>{money(total)}</span>
      </div>

      <form className="checkout-grid" onSubmit={submit}>
        <div className="form-card checkout-form">
          {message && <div className="alert">{message}</div>}
          <input required placeholder="Họ tên người nhận" value={form.customer_name} onChange={(event) => setForm({ ...form, customer_name: event.target.value })} />
          <input required placeholder="Số điện thoại" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <input required placeholder="Địa chỉ giao hàng" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          <textarea placeholder="Ghi chú đơn hàng" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />

          <div className="payment-options">
            <label className={form.payment_method === 'COD' ? 'active' : ''}>
              <input type="radio" name="payment_method" value="COD" checked={form.payment_method === 'COD'} onChange={(event) => setForm({ ...form, payment_method: event.target.value })} />
              <FaTruck />
              <span>{paymentText.COD}</span>
            </label>
            <label className={form.payment_method === 'BANK_TRANSFER' ? 'active' : ''}>
              <input type="radio" name="payment_method" value="BANK_TRANSFER" checked={form.payment_method === 'BANK_TRANSFER'} onChange={(event) => setForm({ ...form, payment_method: event.target.value })} />
              <FaQrcode />
              <span>{paymentText.BANK_TRANSFER}</span>
            </label>
          </div>

          {form.payment_method === 'BANK_TRANSFER' && (
            <div className="qr-card">
              <div className="qr-visual">
                <span>VietQR</span>
                <img src={qrPaymentUrl({ amount: total, orderNumber: `SUACHIMAI ${form.phone || ''}` })} alt="QR chuyển khoản" />
              </div>
              <div className="qr-info">
                <span className="section-kicker">Thanh toán QR</span>
                <h3>Quét mã để chuyển khoản</h3>
                <p>Thông tin chuyển khoản đã được điền sẵn số tiền. Sau khi đặt hàng, bạn có thể in hóa đơn và đối chiếu mã đơn.</p>
                <div className="qr-payment-lines">
                  <span>Ngân hàng</span><strong>MB Bank</strong>
                  <span>Số tài khoản</span><strong>{storePayment.accountNo}</strong>
                  <span>Chủ tài khoản</span><strong>{storePayment.accountName}</strong>
                  <span>Số tiền</span><strong className="qr-amount">{money(total)}</strong>
                  <span>Nội dung</span><strong>SUACHIMAI {form.phone || 'SDT'}</strong>
                </div>
              </div>
            </div>
          )}

          <button className="btn primary full" disabled={!items.length}>
            <FaMoneyBillWave /> Xác nhận đặt hàng
          </button>
        </div>

        <aside className="summary checkout-summary">
          <h3>Tóm tắt giỏ hàng</h3>
          {items.map((item) => (
            <p key={item.id}>
              {item.name} x {item.quantity}
              <b>{money((item.sale_price || item.price) * item.quantity)}</b>
            </p>
          ))}
          <hr />
          <strong>{money(total)}</strong>
        </aside>
      </form>
    </section>
  );
}
