import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhoneAlt, FaPrint, FaTruck, FaUser } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import api, { imageUrl } from '../api/client';
import Loading from '../components/Loading';
import { useFetch } from '../hooks/useFetch';
import { money, paymentText, statusText } from '../utils/format';
import { qrPaymentUrl, storePayment } from '../utils/payment';

const formatDate = (value, withTime = false) => {
  if (!value) return '';
  return new Date(value).toLocaleString('vi-VN', withTime ? undefined : { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data, loading, setData } = useFetch(() => api.get(`/orders/${id}`), [id]);

  const cancel = async () => {
    await api.put(`/orders/${id}/cancel`);
    setData({ ...data, order_status: 'CANCELLED' });
  };

  if (loading) return <Loading />;

  const items = (typeof data.items === 'string' ? JSON.parse(data.items || '[]') : data.items || [])
    .filter((item) => item && item.product_id);
  const orderNumber = data.order_number || `CM${String(data.id).padStart(6, '0')}`;
  const shippingFee = 0;
  const discount = 0;
  const subtotal = Number(data.total_amount || 0);
  const grandTotal = subtotal + shippingFee - discount;

  return (
    <section className="section invoice-page">
      <div className="invoice-actions no-print">
        {data.order_status === 'PENDING' && <button className="btn danger" onClick={cancel}>Hủy đơn hàng</button>}
        <button className="btn primary" onClick={() => window.print()}><FaPrint /> In hóa đơn</button>
      </div>

      <article className="invoice-sheet">
        <header className="invoice-header">
          <div className="invoice-brand-block">
            <div className="invoice-logo">Chi Mai<br /><span>Milk</span></div>
            <div>
              <h1>CHI MAI MILK</h1>
              <p>Chuyên cung cấp sữa và sản phẩm dinh dưỡng</p>
              <p><FaPhoneAlt /> Hotline: {storePayment.hotline}</p>
              <p><FaEnvelope /> Email: {storePayment.email}</p>
              <p><FaMapMarkerAlt /> Địa chỉ: {storePayment.address}</p>
            </div>
          </div>

          <div className="invoice-title-block">
            <h2>HÓA ĐƠN</h2>
            <p>Mã đơn: <strong>#{orderNumber}</strong></p>
            <p>Ngày đặt: {formatDate(data.created_at, true)}</p>
            <p>Ngày in: {formatDate(new Date())}</p>
          </div>
        </header>

        <div className="invoice-info-grid">
          <section className="invoice-box">
            <h3><FaUser /> Thông tin khách hàng</h3>
            <dl>
              <dt>Họ tên:</dt><dd>{data.customer_name}</dd>
              <dt>Số điện thoại:</dt><dd>{data.phone}</dd>
              <dt>Email:</dt><dd>{data.email || 'Chưa có'}</dd>
              <dt>Địa chỉ:</dt><dd>{data.address}</dd>
            </dl>
          </section>

          <section className="invoice-box">
            <h3><FaTruck /> Thông tin đơn hàng</h3>
            <dl>
              <dt>Phương thức thanh toán:</dt><dd>{paymentText[data.payment_method] || data.payment_method}</dd>
              <dt>Trạng thái đơn hàng:</dt><dd><span className="invoice-status">{statusText[data.order_status]}</span></dd>
              <dt>Trạng thái thanh toán:</dt><dd>{data.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</dd>
              <dt>Ghi chú:</dt><dd>{data.note || 'Không có'}</dd>
            </dl>
          </section>
        </div>

        {data.payment_method === 'BANK_TRANSFER' && (
          <section className="invoice-box invoice-qr">
            <img src={qrPaymentUrl({ amount: grandTotal, orderNumber })} alt="QR thanh toán" />
            <div>
              <h3>Thanh toán bằng QR Code</h3>
              <p>Quét mã để chuyển khoản đúng số tiền và nội dung.</p>
              <p>Số tài khoản: <strong>{storePayment.accountNo}</strong></p>
              <p>Chủ tài khoản: <strong>{storePayment.accountName}</strong></p>
              <p>Nội dung: <strong>{orderNumber}</strong></p>
            </div>
          </section>
        )}

        <table className="invoice-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`${item.product_id}-${index}`}>
                <td>{index + 1}</td>
                <td>
                  <div className="invoice-product">
                    <img src={imageUrl(item.image)} alt={item.product_name} />
                    <span>{item.product_name}</span>
                  </div>
                </td>
                <td>{money(item.price)}</td>
                <td>{item.quantity}</td>
                <td>{money(item.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-bottom-grid">
          <section className="invoice-box invoice-shipping">
            <h3><FaTruck /> Thông tin giao hàng</h3>
            <dl>
              <dt>Đơn vị vận chuyển:</dt><dd>Giao hàng nhanh</dd>
              <dt>Phí vận chuyển:</dt><dd>{money(shippingFee)}</dd>
              <dt>Dự kiến giao hàng:</dt><dd>1-2 ngày sau khi xác nhận</dd>
            </dl>
          </section>

          <section className="invoice-total-box">
            <p><span>Tạm tính:</span><b>{money(subtotal)}</b></p>
            <p><span>Phí vận chuyển:</span><b>{money(shippingFee)}</b></p>
            <p><span>Giảm giá:</span><b className="discount">- {money(discount)}</b></p>
            <div>
              <span>Tổng thanh toán:</span>
              <strong>{money(grandTotal)}</strong>
            </div>
          </section>
        </div>

        <footer className="invoice-footer">
          <p>Cảm ơn quý khách đã mua hàng tại Chi Mai Milk!</p>
          <small>Rất mong được phục vụ quý khách lần sau.</small>
          <div>
            <span><FaPhoneAlt /> {storePayment.hotline}</span>
            <span><FaGlobe /> {storePayment.website}</span>
          </div>
        </footer>
      </article>
    </section>
  );
}
