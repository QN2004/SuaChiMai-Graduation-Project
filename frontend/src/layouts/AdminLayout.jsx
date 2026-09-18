import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBox,
  FaChartLine,
  FaComments,
  FaImage,
  FaLayerGroup,
  FaNewspaper,
  FaShoppingCart,
  FaSignOutAlt,
  FaStore,
  FaTags,
  FaUsers
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const links = [
  ['Tổng quan', '/admin', <FaChartLine />],
  ['Danh mục', '/admin/categories', <FaLayerGroup />],
  ['Thương hiệu', '/admin/brands', <FaTags />],
  ['Sản phẩm', '/admin/products', <FaBox />],
  ['Đơn hàng', '/admin/orders', <FaShoppingCart />],
  ['Khách hàng', '/admin/users', <FaUsers />],
  ['Đánh giá', '/admin/reviews', <FaComments />],
  ['Banner', '/admin/banners', <FaImage />],
  ['Tin tức', '/admin/news', <FaNewspaper />],
  ['Liên hệ', '/admin/contacts', <FaComments />]
];

const pageTitles = {
  '/admin': 'Tổng quan vận hành',
  '/admin/categories': 'Quản lý danh mục',
  '/admin/brands': 'Quản lý thương hiệu',
  '/admin/products': 'Quản lý sản phẩm',
  '/admin/orders': 'Quản lý đơn hàng',
  '/admin/users': 'Quản lý khách hàng',
  '/admin/reviews': 'Quản lý đánh giá',
  '/admin/banners': 'Quản lý banner',
  '/admin/news': 'Quản lý tin tức',
  '/admin/contacts': 'Tư vấn khách hàng'
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Quản trị hệ thống';

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span><FaStore /></span>
          <div>
            <strong>Sữa Chi Mai</strong>
            <small>Admin Console</small>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Quản trị">
          {links.map(([label, to, icon]) => (
            <NavLink key={to} to={to} end={to === '/admin'}>
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>Đang quản trị</span>
            <strong>{title}</strong>
          </div>
          <div className="admin-account">
            <span>{user?.full_name || 'Admin'}</span>
            <button
              className="btn ghost"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
            >
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        </header>
        <Outlet />
      </section>
    </div>
  );
}
