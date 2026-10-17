import { useMemo, useState } from 'react';
import { FaBoxOpen, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useFetch } from '../hooks/useFetch';
import { useUiFeedback } from '../context/UiFeedbackContext';
import {
  isCompletedStatus,
  isProcessingStatus,
  money,
  orderCode,
  paymentStatusText,
  paymentText,
  statusText,
  statusTone
} from '../utils/format';

const statusFilters = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: statusText.PENDING },
  { value: 'CONFIRMED', label: statusText.CONFIRMED },
  { value: 'SHIPPING', label: statusText.SHIPPING },
  { value: 'COMPLETED', label: statusText.COMPLETED },
  { value: 'CANCELLED', label: statusText.CANCELLED }
];

export default function MyOrdersPage() {
  const { toast, confirm } = useUiFeedback();
  const { data, loading, setData } = useFetch(() => api.get('/orders/my-orders'), []);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const orders = data ?? [];

  const stats = useMemo(() => {
    const processing = orders.filter((order) => isProcessingStatus(order.order_status)).length;
    const completed = orders.filter((order) => isCompletedStatus(order.order_status)).length;
    const spent = orders
      .filter((order) => order.order_status !== 'CANCELLED')
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    return { processing, completed, spent };
  }, [orders]);

  const visibleOrders = statusFilter
    ? orders.filter((order) => order.order_status === statusFilter)
    : orders;

  const cancelOrder = async (order) => {
    const ok = await confirm({
      title: 'Hủy đơn hàng?',
      message: `Đơn ${orderCode(order)} sẽ bị hủy. Tồn kho sản phẩm sẽ được hoàn lại.`,
      confirmText: 'Hủy đơn',
      cancelText: 'Giữ đơn',
      tone: 'danger'
    });
    if (!ok) return;
    setCancellingId(order.id);
    try {
      await api.put(`/orders/${order.id}/cancel`);
      setData(orders.map((item) => (
        item.id === order.id ? { ...item, order_status: 'CANCELLED' } : item
      )));
      toast('Đã hủy đơn hàng');
    } catch (err) {
      toast(err.message || 'Không thể hủy đơn hàng', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <section className={`section orders-page page-shell${loading ? ' is-refreshing' : ''}`}>
      <div className="section-title">
        <div>
          <span className="section-kicker">Tài khoản</span>
          <h2>Đơn hàng của tôi</h2>
          <p>Theo dõi trạng thái giao hàng, thanh toán và hủy đơn đang chờ xác nhận.</p>
        </div>
        <Link className="btn ghost" to="/products">Tiếp tục mua sắm</Link>
      </div>

      <div className="orders-stats">
        <article>
          <span>Tổng đơn</span>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <span>Đang xử lý</span>
          <strong>{stats.processing}</strong>
        </article>
        <article>
          <span>Hoàn thành</span>
          <strong>{stats.completed}</strong>
        </article>
        <article>
          <span>Tổng chi tiêu</span>
          <strong>{money(stats.spent)}</strong>
        </article>
      </div>

      <div className="orders-toolbar" role="tablist" aria-label="Lọc theo trạng thái">
        {statusFilters.map((filter) => (
          <button
            type="button"
            role="tab"
            key={filter.value || 'all'}
            className={`orders-filter${statusFilter === filter.value ? ' active' : ''}`}
            aria-selected={statusFilter === filter.value}
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleOrders.length ? (
        <div className="orders-list">
          {visibleOrders.map((order) => {
            const itemCount = Number(order.item_count || 0);
            const itemQty = Number(order.item_qty || 0);
            return (
              <article className="order-card" key={order.id}>
                <div className="order-card-head">
                  <div>
                    <span className="order-code">{orderCode(order)}</span>
                    <p>
                      Đặt ngày {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '—'}
                    </p>
                  </div>
                  <span className={`status-chip ${statusTone(order.order_status)}`}>
                    {statusText[order.order_status] || order.order_status}
                  </span>
                </div>

                <div className="order-card-meta">
                  <span>{itemQty || itemCount ? `${itemQty || itemCount} sản phẩm` : 'Chưa có sản phẩm'}</span>
                  <span>{paymentText[order.payment_method] || order.payment_method}</span>
                  <span className={`status-chip compact ${order.payment_status === 'PAID' ? 'success' : 'muted'}`}>
                    {paymentStatusText[order.payment_status] || 'Chưa thanh toán'}
                  </span>
                </div>

                <div className="order-card-foot">
                  <strong>{money(order.total_amount)}</strong>
                  <div className="order-card-actions">
                    {order.order_status === 'PENDING' && (
                      <button
                        className="btn danger"
                        type="button"
                        disabled={cancellingId === order.id}
                        onClick={() => cancelOrder(order)}
                      >
                        {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                      </button>
                    )}
                    <Link className="btn primary" to={`/my-orders/${order.id}`}>Xem chi tiết</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="orders-empty">
          <FaBoxOpen />
          <h3>{orders.length ? 'Không có đơn phù hợp với bộ lọc' : 'Bạn chưa có đơn hàng nào'}</h3>
          <p>
            {orders.length
              ? 'Thử chọn trạng thái khác để xem các đơn còn lại.'
              : 'Chọn sữa phù hợp rồi đặt hàng, mọi đơn sẽ hiện tại đây.'}
          </p>
          {!orders.length && (
            <Link className="btn primary" to="/products">
              <FaShoppingBag /> Mua sắm ngay
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
