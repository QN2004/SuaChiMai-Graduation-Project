import { Link, useParams } from 'react-router-dom';
import api, { imageUrl } from '../api/client';
import Loading from '../components/Loading';
import { useFetch } from '../hooks/useFetch';
import { money, paymentText, statusText } from '../utils/format';

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

  return (
    <section className="section">
      <div className="section-title">
        <div>
          <span className="section-kicker">Đơn hàng</span>
          <h2>#{orderNumber}</h2>
          <p>Ngày đặt: {data.created_at ? new Date(data.created_at).toLocaleString('vi-VN') : ''}</p>
        </div>
        <div className="profile-actions">
          <Link className="btn ghost" to="/my-orders">Danh sách đơn</Link>
          {data.order_status === 'PENDING' && (
            <button className="btn danger" type="button" onClick={cancel}>Hủy đơn</button>
          )}
        </div>
      </div>

      <div className="panel" style={{ display: 'grid', gap: 16, padding: 20 }}>
        <div className="detail-meta" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          <div>
            <strong>Người nhận</strong>
            <p>{data.customer_name}</p>
            <p>{data.phone}</p>
            <p>{data.address}</p>
          </div>
          <div>
            <strong>Trạng thái</strong>
            <p>{statusText[data.order_status] || data.order_status}</p>
            <p>{paymentText[data.payment_method] || data.payment_method}</p>
            <p>{data.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
          </div>
          <div>
            <strong>Ghi chú</strong>
            <p>{data.note || 'Không có'}</p>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`${item.product_id}-${index}`}>
                <td>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <img src={imageUrl(item.image)} alt={item.product_name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
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

        <div style={{ textAlign: 'right', fontSize: 18 }}>
          <strong>Tổng cộng: {money(data.total_amount)}</strong>
        </div>
      </div>
    </section>
  );
}
