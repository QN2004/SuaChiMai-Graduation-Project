import { Fragment, useState } from 'react';
import api from '../../api/client';
import { useFetch } from '../../hooks/useFetch';
import { useUiFeedback } from '../../context/UiFeedbackContext';
import { money, paymentText, statusText } from '../../utils/format';
import { cancelReasonText, orderStatusLabel } from '../../utils/baby';
import { formatDate } from '../../utils/expiry';

const orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];
// Khớp ORDER_TRANSITIONS ở backend: chỉ cho chọn trạng thái hiện tại và các bước kế tiếp hợp lệ.
const nextStatuses = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPING', 'CANCELLED'],
  SHIPPING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: []
};

export default function AdminOrderPage() {
  const [status, setStatus] = useState('');
  const { data, loading, setData } = useFetch(() => api.get('/orders', { params: { status } }), [status]);
  const { toast, confirm } = useUiFeedback();

  const [detail, setDetail] = useState({});

  const toggleDetail = async (id) => {
    if (detail[id]) { setDetail({ ...detail, [id]: null }); return; }
    const res = await api.get(`/orders/${id}`);
    setDetail({ ...detail, [id]: res.data });
  };

  const update = async (id, patch) => {
    if (patch.order_status === 'CANCELLED') {
      const reason = cancelReasonText[patch.cancel_reason] || 'Hủy đơn';
      const ok = await confirm({
        title: `${reason}?`,
        message: `Đơn #${id} chuyển sang Đã hủy (${reason.toLowerCase()}). Hàng được trả về đúng các lô đã xuất.`,
        confirmText: reason,
        cancelText: 'Giữ đơn'
      });
      if (!ok) return;
    }
    try {
      await api.put(`/orders/${id}/status`, patch);
      setData(data.map((order) => (order.id === id ? { ...order, ...patch } : order)));
      toast('Đã cập nhật đơn hàng');
    } catch (err) {
      toast(err.message || 'Không cập nhật được đơn hàng', 'error');
    }
  };

  const orders = data ?? [];
  const totalRevenue = orders
    .filter((order) => order.order_status === 'COMPLETED')
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

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
          <span><strong>{money(totalRevenue)}</strong> doanh thu hoàn thành</span>
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
              <Fragment key={order.id}>
              <tr>
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
                  <select
                    value={order.order_status === 'CANCELLED' ? `CANCELLED:${order.cancel_reason || 'STORE'}` : order.order_status}
                    disabled={!nextStatuses[order.order_status]?.length}
                    onChange={(event) => {
                      const [orderStatus, cancelReason] = event.target.value.split(':');
                      update(order.id, cancelReason ? { order_status: orderStatus, cancel_reason: cancelReason } : { order_status: orderStatus });
                    }}
                  >
                    {order.order_status === 'CANCELLED'
                      ? <option value={`CANCELLED:${order.cancel_reason || 'STORE'}`}>{orderStatusLabel(order, statusText)}</option>
                      : <option value={order.order_status}>{statusText[order.order_status]}</option>}
                    {(nextStatuses[order.order_status] || []).flatMap((key) => (key === 'CANCELLED'
                      ? (['CONFIRMED', 'SHIPPING'].includes(order.order_status) ? ['STORE', 'DELIVERY_FAILED', 'RETURNED'] : ['STORE'])
                        .map((reason) => <option key={reason} value={`CANCELLED:${reason}`}>{reason === 'STORE' ? 'Hủy đơn' : cancelReasonText[reason]}</option>)
                      : [<option value={key} key={key}>{statusText[key]}</option>]))}
                  </select>
                  <button type="button" className="link-btn" onClick={() => toggleDetail(order.id)}>{detail[order.id] ? 'Ẩn chi tiết' : 'Chi tiết lô'}</button>
                </td>
              </tr>
              {detail[order.id] && (
                <tr className="order-lot-detail">
                  <td colSpan="6">
                    <div className="lot-card">
                      <table>
                        <thead><tr><th>Dòng đơn</th><th>Đơn giá</th><th>SL</th><th>Thành tiền</th><th>Xuất từ lô (FEFO)</th></tr></thead>
                        <tbody>
                          {detail[order.id].items.map((item) => (
                            <tr key={item.id}>
                              <td>{item.product_name}</td>
                              <td>{money(item.price)}</td>
                              <td>{item.quantity}</td>
                              <td>{money(item.total_price)}</td>
                              <td>
                                {item.batches.length ? item.batches.map((b) => (
                                  <span className="lot-tag" key={b.lot_number}><strong>{b.lot_number}</strong> HSD {formatDate(b.expiry_date)} × {b.quantity}</span>
                                )) : <span className="sub">Không có dữ liệu lô</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr><td colSpan="3">Tổng đơn</td><td colSpan="2">{money(detail[order.id].total_amount)}</td></tr>
                        </tfoot>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
              </Fragment>
            )) : (
              <tr><td colSpan="6"><div className="empty-state">Không có đơn hàng phù hợp bộ lọc hiện tại.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
