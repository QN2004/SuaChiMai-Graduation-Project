import { useState } from 'react';
import api from '../../api/client';
import { useFetch } from '../../hooks/useFetch';
import { money, paymentText, statusText } from '../../utils/format';

const orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

export default function AdminOrderPage() {
  const [status, setStatus] = useState('');
  const { data, loading, setData } = useFetch(() => api.get('/orders', { params: { status } }), [status]);

  const update = async (id, patch) => {
    await api.put(`/orders/${id}/status`, patch);
    setData(data.map((order) => (order.id === id ? { ...order, ...patch } : order)));
  };

  const orders = data ?? [];
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  return (
    <div className={`admin-page${loading ? ' is-refreshing' : ''}`}>
      <div className="admin-hero">
        <div>
          <span className="admin-kicker">Vận hành</span>
          <h1>Quản lý đơn hàng</h1>
          <p>Theo dõi trạng thái giao dịch, thanh toán và tiến độ xử lý đơn trong một màn hình.</p>
        </div>
        <div className="admin-hero-metrics">
          <span><strong>{orders.length}</strong> đơn</span>
          <span><strong>{money(totalRevenue)}</strong> doanh thu lọc</span>
        </div>
      </div>

      <div className="panel table-wrap">
        <div className="panel-toolbar">
          <h3>Danh sách đơn hàng</h3>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {orderStatuses.map((key) => (
              <option key={key} value={key}>{statusText[key]}</option>
            ))}
          </select>
        </div>
        <table>
          <thead>
            <tr><th>Mã</th><th>Khách hàng</th><th>Tổng tiền</th><th>Phương thức</th><th>Thanh toán</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {orders.length ? orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td><strong>{order.customer_name}</strong><span className="muted block">{order.phone}</span></td>
                <td>{money(order.total_amount)}</td>
                <td><span className="status-chip muted">{paymentText[order.payment_method] || order.payment_method}</span></td>
                <td>
                  <select value={order.payment_status || 'UNPAID'} onChange={(event) => update(order.id, { payment_status: event.target.value })}>
                    <option value="UNPAID">Chưa thanh toán</option>
                    <option value="PAID">Đã thanh toán</option>
                  </select>
                </td>
                <td>
                  <select value={order.order_status} onChange={(event) => update(order.id, { order_status: event.target.value })}>
                    {orderStatuses.map((key) => (
                      <option value={key} key={key}>{statusText[key]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6"><div className="empty-state">Không có đơn hàng phù hợp bộ lọc hiện tại.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
