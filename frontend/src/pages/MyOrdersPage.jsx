import { Link } from 'react-router-dom';
import api from '../api/client';
import Loading from '../components/Loading';
import { useFetch } from '../hooks/useFetch';
import { money, paymentText, statusText } from '../utils/format';

export default function MyOrdersPage() {
  const { data, loading } = useFetch(() => api.get('/orders/my-orders'), []);
  if (loading) return <Loading />;
  const totalSpent = data.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const pendingCount = data.filter((order) => order.order_status === 'PENDING').length;
  const deliveredCount = data.filter((order) => order.order_status === 'DELIVERED').length;

  return (
    <section className="section">
      <div className="section-title">
        <div>
          <h2>Đơn hàng của tôi</h2>
          <span className="muted">Theo dõi toàn bộ lịch sử mua hàng, trạng thái và chi tiết thanh toán.</span>
        </div>
      </div>

      <div className="order-layout">
        <aside className="order-summary">
          <h3>Tổng quan</h3>
          <div className="stat-line"><span>Số đơn</span><strong>{data.length}</strong></div>
          <div className="stat-line"><span>Chờ xử lý</span><strong>{pendingCount}</strong></div>
          <div className="stat-line"><span>Đã giao</span><strong>{deliveredCount}</strong></div>
          <div className="stat-line total"><span>Tổng chi tiêu</span><strong>{money(totalSpent)}</strong></div>
          <div className="order-toolbar">
            <span className="filter-chip">{statusText.PENDING}</span>
            <span className="filter-chip">{statusText.DELIVERED}</span>
            <span className="filter-chip">{paymentText.COD}</span>
          </div>
        </aside>

        <div className="order-table table-wrap">
          <table>
            <thead>
              <tr><th>Mã</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Thanh toán</th><th>Trạng thái</th><th></th></tr>
            </thead>
            <tbody>
              {data.length ? data.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>{money(o.total_amount)}</td>
                  <td><span className="status status-chip muted">{paymentText[o.payment_method] || o.payment_method}</span></td>
                  <td><span className="status status-chip">{statusText[o.order_status]}</span></td>
                  <td><Link className="detail-link" to={`/my-orders/${o.id}`}>Xem chi tiết</Link></td>
                </tr>
              )) : (
                <tr><td colSpan="6"><div className="order-empty">Bạn chưa có đơn hàng nào.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
