import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaFacebookMessenger,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShoppingBag,
  FaTiktok,
  FaUserCircle,
  FaYoutube
} from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ChatBot from '../components/ChatBot';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="site-header">
        <div className="header-left">
          <Link className="logo" to="/">Sữa Chi Mai</Link>
          <span className="logo-subtitle">Đại Nghĩa, Đại Lộc, Quảng Nam</span>
        </div>
        <button className="icon-btn mobile-only" onClick={() => setOpen(!open)} aria-label="Mở menu">
          <FaBars />
        </button>
        <nav className={open ? 'nav open' : 'nav'}>
          <NavLink to="/" onClick={() => setOpen(false)}>Trang chủ</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>Sản phẩm</NavLink>
          <NavLink to="/gioithieu" onClick={() => setOpen(false)}>Giới thiệu</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Liên hệ</NavLink>
        </nav>
        <input type="text" className="header-search" placeholder="Tìm kiếm sản phẩm..." />
        <div className="header-actions">
          <div className="header-hotline">
            <strong>0987 654 321</strong>
            <span>7:00 - 22:00, tất cả các ngày</span>
          </div>
          <Link className="cart-link" to="/cart" aria-label="Giỏ hàng">
            <FaShoppingBag /><span>{count}</span>
          </Link>
          {user ? (
            <div className="user-menu">
              <Link to={user.role === 'admin' ? '/admin' : '/profile'}><FaUserCircle /> {user.full_name}</Link>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          ) : (
            <Link className="btn ghost" to="/login">Đăng nhập</Link>
          )}
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="footer">
        <div className="footer-brand">
          <Link className="footer-logo" to="/">Sữa Chi Mai</Link>
          <p>Chuyên cung cấp sữa và sản phẩm dinh dưỡng chính hãng, chọn lọc kỹ cho bé, mẹ bầu và mọi gia đình.</p>
          <div className="footer-badges">
            <span>Chính hãng</span>
            <span>Tư vấn tận tâm</span>
          </div>
        </div>

        <div className="footer-section">
          <strong>Địa chỉ</strong>
          <p className="footer-info"><FaMapMarkerAlt /> Đại Nghĩa, Đại Lộc, Quảng Nam</p>
        </div>

        <div className="footer-section">
          <strong>Liên hệ</strong>
          <p className="footer-info"><FaPhoneAlt /> 0987 654 321</p>
          <p className="footer-info"><FaEnvelope /> suachimai.dailoc@gmail.com</p>
        </div>

        <div className="footer-section">
          <strong>Giờ mở cửa</strong>
          <p className="footer-info"><FaClock /> 7:00 - 22:00 tất cả các ngày trong tuần</p>
        </div>

        <div className="footer-section">
          <strong>Kết nối với chúng tôi</strong>
          <div className="social-links">
            <a href="#" title="Facebook" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" title="Messenger" aria-label="Messenger"><FaFacebookMessenger /></a>
            <a href="#" title="TikTok" aria-label="TikTok"><FaTiktok /></a>
            <a href="#" title="YouTube" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </footer>
      <ChatBot />
    </>
  );
}
