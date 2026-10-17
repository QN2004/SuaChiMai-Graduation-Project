import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FaBox, FaLayerGroup, FaShoppingCart, FaTags, FaUserFriends, FaWallet } from 'react-icons/fa';
import api from '../../api/client';
import { useFetch } from '../../hooks/useFetch';
import { money, statusText } from '../../utils/format';

const emptyDashboard = {
  products: { total: 0 },
  categories: { total: 0 },
  brands: { total: 0 },
  users: { total: 0 },
  orders: { total: 0 },
  revenue: { total: 0 },
  pending: { total: 0 },
  lowStock: [],
  latestOrders: [],
  revenueChart: []
};

export default function AdminDashboardPage() {
  const { data, loading } = useFetch(async () => {
    const [dash, revenue] = await Promise.all([
      api.get('/statistics/dashboard'),
      api.get('/statistics/revenue-by-month')
    ]);

    return { data: { ...dash.data, revenueChart: revenue.data } };
  }, []);

  const dashboard = { ...emptyDashboard, ...data };
  const cards = [
    ['Sản phẩm', dashboard.products.total, <FaBox />],
    ['Danh mục', dashboard.categories.total, <FaLayerGroup />],
    ['Thương hiệu', dashboard.brands.total, <FaTags />],
    ['Khách hàng', dashboard.users.total, <FaUserFriends />],
    ['Đơn hàng', dashboard.orders.total, <FaShoppingCart />],
    ['Doanh thu', money(dashboard.revenue.total), <FaWallet />]
  ];

  return (
    <div className={`admin-page${loading ? ' is-refreshing' : ''}`}>
      <div className="admin-hero">
        <div>
          <span className="admin-kicker">Tổng quan hôm nay</span>
          <h1>Bảng điều khiển</h1>
          <p>Theo dõi nhanh doanh thu, đơn hàng, tồn kho và những hoạt động mới nhất của cửa hàng.</p>
        </div>
        <div className="admin-hero-metrics">
          <span><strong>{dashboard.pending.total}</strong> đơn chờ xử lý</span>
          <span><strong>{dashboard.lowStock.length}</strong> sản phẩm sắp hết</span>
        </div>
      </div>

      <div className="stat-grid">
        {cards.map(([label, value, icon]) => (
          <div className="stat-card" key={label}>
            <span className="stat-icon">{icon}</span>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="admin-grid admin-grid-dashboard">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Doanh thu theo tháng</h3>
              <p>Chỉ tính các đơn đã hoàn thành.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => money(value)} />
              <Bar dataKey="revenue" fill="#2f9eaa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel admin-list-panel">
          <div className="panel-head">
            <div>
              <h3>Đơn hàng mới</h3>
              <p>Các đơn gần nhất trong hệ thống.</p>
            </div>
          </div>
          {dashboard.latestOrders.length ? dashboard.latestOrders.map((order) => (
            <p key={order.id}>
              <span>#{order.id} - {order.customer_name}</span>
              <b>{statusText[order.order_status] || order.order_status}</b>
            </p>
          )) : (
            <div className="empty-state">Chưa có đơn hàng mới.</div>
          )}
        </section>
      </div>

      <section className="panel admin-list-panel">
        <div className="panel-head">
          <div>
            <h3>Sản phẩm sắp hết hàng</h3>
            <p>Ưu tiên nhập thêm các sản phẩm dưới hoặc bằng 10 đơn vị.</p>
          </div>
        </div>
        {dashboard.lowStock.length ? dashboard.lowStock.map((product) => (
          <p key={product.id}>
            <span>{product.name}</span>
            <b>{product.stock}</b>
          </p>
        )) : (
          <div className="empty-state">Kho hiện chưa có sản phẩm gần hết.</div>
        )}
      </section>
    </div>
  );
}
