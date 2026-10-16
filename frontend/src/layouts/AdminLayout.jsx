import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBox,
  FaChartLine,
  FaComments,
  FaEnvelopeOpenText,
  FaExternalLinkAlt,
  FaLayerGroup,
  FaShoppingCart,
  FaSignOutAlt,
  FaStore,
  FaTags,
  FaUsers
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import useDocumentMeta from '../hooks/useDocumentMeta';

const navGroups = [
  {
    label: 'Vận hành',
    items: [
      ['Tổng quan', '/admin', <FaChartLine />],
      ['Đơn hàng', '/admin/orders', <FaShoppingCart />],
      ['Sản phẩm', '/admin/products', <FaBox />]
    ]
  },
  {
    label: 'Danh mục hàng',
    items: [
      ['Danh mục', '/admin/categories', <FaLayerGroup />],
      ['Thương hiệu', '/admin/brands', <FaTags />]
    ]
  },
  {
    label: 'Khách hàng',
    items: [
      ['Khách hàng', '/admin/users', <FaUsers />],
      ['Đánh giá', '/admin/reviews', <FaComments />],
      ['Liên hệ', '/admin/contacts', <FaEnvelopeOpenText />]
    ]
  }
];

const pageTitles = {
  '/admin': 'Tổng quan vận hành',
  '/admin/categories': 'Quản lý danh mục',
  '/admin/brands': 'Quản lý thương hiệu',
  '/admin/products': 'Quản lý sản phẩm',
  '/admin/orders': 'Quản lý đơn hàng',
  '/admin/users': 'Quản lý khách hàng',
  '/admin/reviews': 'Quản lý đánh giá',
  '/admin/contacts': 'Tư vấn khách hàng'
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Quản trị hệ thống';

  useDocumentMeta({
    title: `${title} | Quản trị Sữa Chi Mai`,
    favicon: '/favicon-admin.ico'
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark"><FaStore /></span>
          <div>
            <strong>Sữa Chi Mai</strong>
            <small>Bảng quản trị</small>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Quản trị">
          {navGroups.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <p className="admin-nav-label">{group.label}</p>
              {group.items.map(([label, to, icon]) => (
                <NavLink key={to} to={to} end={to === '/admin'}>
                  <span className="admin-nav-icon">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">{(user?.full_name || 'A').charAt(0).toUpperCase()}</div>
            <div className="admin-user-meta">
              <strong>{user?.full_name || 'Admin'}</strong>
              <small>{user?.email || 'Quản trị viên'}</small>
            </div>
          </div>
          <button className="admin-logout-btn" type="button" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span>Khu quản trị</span>
            <strong>{title}</strong>
          </div>
          <NavLink className="admin-store-link" to="/" target="_blank" rel="noreferrer">
            <FaExternalLinkAlt />
            <span>Xem cửa hàng</span>
          </NavLink>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
