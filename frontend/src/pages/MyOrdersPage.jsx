import { useMemo, useState } from 'react';
import {
  FaArrowRight,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaReceipt,
  FaShoppingBag,
  FaWallet
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useUiFeedback } from '../context/UiFeedbackContext';
import { useFetch } from '../hooks/useFetch';
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

const formatOrderDate = (value) => value
  ? new Date(value).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
  : 'Chưa cập nhật';

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
      .filter((order) => isCompletedStatus(order.order_status))
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

  const statCards = [
    { label: 'Tổng đơn hàng', value: orders.length, icon: <FaReceipt />, tone: 'pink' },
    { label: 'Đang xử lý', value: stats.processing, icon: <FaClock />, tone: 'amber' },
    { label: 'Đã hoàn thành', value: stats.completed, icon: <FaCheckCircle />, tone: 'green' },
    { label: 'Tổng chi tiêu', value: money(stats.spent), icon: <FaWallet />, tone: 'blue' }
  ];

  return (
    <main className={`orders-page orders-page-v2 page-shell${loading ? ' is-refreshing' : ''}`}>
      <div className="orders-shell">
        <header className="orders-header">
          <div>
            <span className="section-kicker">Tài khoản của bạn</span>
            <h1>Đơn hàng của tôi</h1>
            <p>Theo dõi trạng thái, thanh toán và lịch sử mua hàng tại một nơi.</p>
          </div>
          <Link className="btn ghost orders-shop-link" to="/products"><FaShoppingBag /> Tiếp tục mua sắm</Link>
        </header>

        <section className="orders-stats orders-stats-v2" aria-label="Tổng quan đơn hàng">
          {statCards.map((card) => (
            <article key={card.label}>
              <span className={`orders-stat-icon ${card.tone}`}>{card.icon}</span>
              <div><span>{card.label}</span><strong>{card.value}</strong></div>
            </article>
          ))}
        </section>

        <div className="orders-filter-wrap">
          <div className="orders-toolbar" role="tablist" aria-label="Lọc theo trạng thái">
            {statusFilters.map((filter) => {
              const count = filter.value
                ? orders.filter((order) => order.order_status === filter.value).length
                : orders.length;
              return (
                <button
                  type="button"
                  role="tab"
                  key={filter.value || 'all'}
                  className={`orders-filter${statusFilter === filter.value ? ' active' : ''}`}
                  aria-selected={statusFilter === filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}<span>{count}</span>
                </button>
              );
            })}
          </div>
          <span className="orders-result-count">{visibleOrders.length} đơn hàng</span>
        </div>

        {visibleOrders.length ? (
          <div className="orders-list orders-list-v2">
            {visibleOrders.map((order) => {
              const itemCount = Number(order.item_count || 0);
              const itemQty = Number(order.item_qty || 0);
              return (
                <article className="order-card order-card-v2" key={order.id}>
                  <div className="order-card-main">
                    <div className="order-card-identity">
                      <span className="order-card-icon"><FaBoxOpen /></span>
                      <div>
                        <span className="order-code">{orderCode(order)}</span>
                        <p>{formatOrderDate(order.created_at)}</p>
                      </div>
                    </div>
                    <span className={`status-chip ${statusTone(order.order_status)}`}>
                      {statusText[order.order_status] || order.order_status}
                    </span>
                  </div>

                  <div className="order-card-details">
                    <div><span>Sản phẩm</span><strong>{itemQty || itemCount || 0}</strong></div>
                    <div><span>Thanh toán</span><strong>{paymentText[order.payment_method] || order.payment_method}</strong></div>
                    <div><span>Trạng thái tiền</span><strong>{paymentStatusText[order.payment_status] || 'Chưa thanh toán'}</strong></div>
                    <div className="order-card-amount"><span>Tổng tiền</span><strong>{money(order.total_amount)}</strong></div>
                  </div>

                  <div className="order-card-foot order-card-foot-v2">
                    <span>{order.order_status === 'PENDING' ? 'Bạn có thể hủy trước khi cửa hàng xác nhận.' : 'Xem chi tiết để theo dõi đơn hàng.'}</span>
                    <div className="order-card-actions">
                      {order.order_status === 'PENDING' && (
                        <button
                          className="btn order-cancel-btn"
                          type="button"
                          disabled={cancellingId === order.id}
                          onClick={() => cancelOrder(order)}
                        >
                          {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                        </button>
                      )}
                      <Link className="btn primary order-detail-link" to={`/my-orders/${order.id}`}>Xem chi tiết <FaArrowRight /></Link>
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
            <p>{orders.length ? 'Thử chọn trạng thái khác để xem các đơn còn lại.' : 'Chọn sữa phù hợp rồi đặt hàng, mọi đơn sẽ hiện tại đây.'}</p>
            {!orders.length && <Link className="btn primary" to="/products"><FaShoppingBag /> Mua sắm ngay</Link>}
          </div>
        )}
      </div>
    </main>
  );
}
