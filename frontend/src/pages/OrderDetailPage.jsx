import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaClipboardCheck,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStickyNote,
  FaTruck,
  FaUser
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import api, { imageUrl } from '../api/client';
import Loading from '../components/Loading';
import { useUiFeedback } from '../context/UiFeedbackContext';
import { useFetch } from '../hooks/useFetch';
import { money, orderCode, paymentStatusText, paymentText, statusText, statusTone } from '../utils/format';
import { qrPaymentUrl, storePayment } from '../utils/payment';

const parseOrderItems = (raw) => {
  try {
    const items = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
    return Array.isArray(items) ? items.filter((item) => item && item.product_id) : [];
  } catch {
    return [];
  }
};

const orderSteps = [
  { key: 'PENDING', label: 'Chờ xác nhận', icon: <FaClipboardCheck /> },
  { key: 'CONFIRMED', label: 'Đã xác nhận', icon: <FaBox /> },
  { key: 'SHIPPING', label: 'Đang giao', icon: <FaTruck /> },
  { key: 'COMPLETED', label: 'Hoàn thành', icon: <FaCheckCircle /> }
];

const normalizedStepIndex = (status) => {
  const key = String(status || '').toUpperCase();
  if (key === 'SHIPPED') return 2;
  if (key === 'DELIVERED') return 3;
  return orderSteps.findIndex((step) => step.key === key);
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { toast, confirm } = useUiFeedback();
  const { data, loading, setData } = useFetch(() => api.get(`/orders/${id}`), [id]);

  const cancel = async () => {
    const ok = await confirm({
      title: 'Hủy đơn hàng?',
      message: 'Đơn đang chờ xác nhận sẽ bị hủy và tồn kho được hoàn lại.',
      confirmText: 'Hủy đơn',
      cancelText: 'Giữ đơn',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      setData({ ...data, order_status: 'CANCELLED' });
      toast('Đã hủy đơn hàng');
    } catch (err) {
      toast(err.message || 'Không thể hủy đơn hàng', 'error');
    }
  };

  if (loading && !data) {
    return <section className="section page-shell"><Loading /></section>;
  }

  if (!data) {
    return (
      <main className="order-detail-page page-shell">
        <section className="order-detail-shell order-detail-empty">
          <h1>Không tìm thấy đơn hàng</h1>
          <Link className="btn primary" to="/my-orders">Quay lại danh sách đơn</Link>
        </section>
      </main>
    );
  }

  const items = parseOrderItems(data.items);
  const orderNumber = orderCode(data);
  const statusKey = String(data.order_status || '').toUpperCase();
  const isCancelled = statusKey === 'CANCELLED';
  const activeStep = normalizedStepIndex(statusKey);
  const orderDate = data.created_at
    ? new Date(data.created_at).toLocaleString('vi-VN', { dateStyle: 'long', timeStyle: 'short' })
    : 'Chưa cập nhật';

  return (
    <main className={`order-detail-page page-shell${loading ? ' is-refreshing' : ''}`}>
      <div className="order-detail-shell">
        <Link className="order-detail-back" to="/my-orders"><FaArrowLeft /> Danh sách đơn hàng</Link>

        <header className="order-detail-header">
          <div>
            <span className="section-kicker">Chi tiết đơn hàng</span>
            <h1>#{orderNumber}</h1>
            <p>{orderDate === 'Chưa cập nhật' ? orderDate : `Đặt ${orderDate}`}</p>
          </div>
          <div className="order-detail-header-actions">
            <span className={`status-chip ${statusTone(data.order_status)}`}>{statusText[data.order_status] || data.order_status}</span>
            {data.order_status === 'PENDING' && <button className="btn order-cancel-btn" type="button" onClick={cancel}>Hủy đơn</button>}
          </div>
        </header>

        {isCancelled ? (
          <section className="order-cancelled-banner">
            <span>Đơn hàng đã được hủy</span>
            <p>Nếu cần hỗ trợ thêm, vui lòng liên hệ cửa hàng để được tư vấn.</p>
          </section>
        ) : (
          <section className="order-progress" aria-label="Tiến trình đơn hàng">
            {orderSteps.map((step, index) => (
              <div className={`${index <= activeStep ? 'active' : ''}${index === activeStep ? ' current' : ''}`} key={step.key}>
                <span>{step.icon}</span>
                <strong>{step.label}</strong>
              </div>
            ))}
          </section>
        )}

        <div className="order-detail-layout">
          <div className="order-detail-main">
            <section className="order-detail-card order-products-card">
              <div className="order-section-heading">
                <div><h2>Sản phẩm đã đặt</h2><p>{items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} sản phẩm trong đơn</p></div>
              </div>

              <div className="order-products-table">
                <div className="order-products-head">
                  <span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Thành tiền</span>
                </div>
                {items.map((item, index) => (
                  <article className="order-product-row" key={`${item.product_id}-${index}`}>
                    <div className="order-product-info">
                      <img src={imageUrl(item.image)} alt={item.product_name} />
                      <strong>{item.product_name}</strong>
                    </div>
                    <span data-label="Đơn giá">{money(item.price)}</span>
                    <span data-label="Số lượng">× {item.quantity}</span>
                    <strong data-label="Thành tiền">{money(item.total_price)}</strong>
                  </article>
                ))}
              </div>
            </section>

            {data.payment_method === 'BANK_TRANSFER' && data.payment_status !== 'PAID' && !isCancelled && (
              <section className="order-detail-card order-payment-qr">
                <div className="qr-card">
                  <div className="qr-visual">
                    <span>VietQR</span>
                    <img src={qrPaymentUrl({ amount: data.total_amount, orderNumber })} alt="QR chuyển khoản" />
                  </div>
                  <div className="qr-info">
                    <span className="section-kicker">Thanh toán QR</span>
                    <h3>Chuyển khoản theo mã đơn</h3>
                    <p>Dùng đúng nội dung bên dưới để cửa hàng đối soát nhanh.</p>
                    <div className="qr-payment-lines">
                      <span>Ngân hàng</span><strong>MB Bank</strong>
                      <span>Số tài khoản</span><strong>{storePayment.accountNo}</strong>
                      <span>Chủ tài khoản</span><strong>{storePayment.accountName}</strong>
                      <span>Số tiền</span><strong>{money(data.total_amount)}</strong>
                      <span>Nội dung</span><strong>{orderNumber}</strong>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <aside className="order-detail-sidebar">
            <section className="order-detail-card order-total-card">
              <span>Tổng thanh toán</span>
              <strong>{money(data.total_amount)}</strong>
              <div><span><FaCreditCard /> Phương thức</span><b>{paymentText[data.payment_method] || data.payment_method}</b></div>
              <div><span>Trạng thái tiền</span><b>{paymentStatusText[data.payment_status] || 'Chưa thanh toán'}</b></div>
            </section>

            <section className="order-detail-card order-recipient-card">
              <h2>Thông tin nhận hàng</h2>
              <p><FaUser /><span><small>Người nhận</small><strong>{data.customer_name}</strong></span></p>
              <p><FaPhoneAlt /><span><small>Số điện thoại</small><strong>{data.phone}</strong></span></p>
              <p><FaMapMarkerAlt /><span><small>Địa chỉ</small><strong>{data.address}</strong></span></p>
            </section>

            <section className="order-detail-card order-note-card">
              <h2><FaStickyNote /> Ghi chú</h2>
              <p>{data.note || 'Không có ghi chú cho đơn hàng này.'}</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
