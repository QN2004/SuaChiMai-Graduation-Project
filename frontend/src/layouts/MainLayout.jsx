import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaFacebookMessenger,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaShoppingBag,
  FaSignOutAlt,
  FaTiktok,
  FaUserCircle,
  FaYoutube
} from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  useDocumentMeta({
    title: 'Sữa Chi Mai | Cửa hàng sữa chính hãng',
    favicon: '/favicon.ico'
  });

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate('/');
  };

  const submitHeaderSearch = (event) => {
    event.preventDefault();
    const q = headerSearch.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
    setOpen(false);
  };

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const accountHref = user?.role === 'admin' ? '/admin' : '/profile';

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

        <nav className={open ? 'nav open' : 'nav'} aria-label="Điều hướng chính">
          <NavLink to="/" end onClick={() => setOpen(false)}>Trang chủ</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>Sản phẩm</NavLink>
          <NavLink to="/gioithieu" onClick={() => setOpen(false)}>Giới thiệu</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Liên hệ</NavLink>
        </nav>

        <form className="header-search-form" onSubmit={submitHeaderSearch}>
          <FaSearch className="header-search-icon" aria-hidden="true" />
          <input
            type="search"
            className="header-search"
            placeholder="Tìm kiếm sản phẩm..."
            value={headerSearch}
            onChange={(event) => setHeaderSearch(event.target.value)}
          />
          <button type="submit" className="header-search-btn">Tìm</button>
        </form>

        <div className="header-actions">
          <a className="header-hotline" href="tel:0987654321">
            <span className="header-hotline-icon"><FaPhoneAlt /></span>
            <span className="header-hotline-text">
              <strong>0987 654 321</strong>
              <small>7:00 - 22:00 mỗi ngày</small>
            </span>
          </a>

          <Link className="cart-link" to="/cart" aria-label={`Giỏ hàng (${count})`}>
            <FaShoppingBag />
            <span>{count}</span>
          </Link>

          {user ? (
            <div className={`account-menu${accountOpen ? ' open' : ''}`} ref={accountRef}>
              <button
                type="button"
                className="account-trigger"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((value) => !value)}
              >
                <span className="account-avatar">{(user.full_name || 'U').charAt(0).toUpperCase()}</span>
                <span className="account-meta">
                  <strong>{user.full_name}</strong>
                  <small>{user.role === 'admin' ? 'Quản trị viên' : 'Tài khoản của bạn'}</small>
                </span>
              </button>

              <div className="account-dropdown" role="menu">
                <Link
                  role="menuitem"
                  to={accountHref}
                  onClick={() => setAccountOpen(false)}
                >
                  <FaUserCircle />
                  {user.role === 'admin' ? 'Vào trang quản trị' : 'Hồ sơ của tôi'}
                </Link>
                <button type="button" role="menuitem" className="account-logout" onClick={handleLogout}>
                  <FaSignOutAlt />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link className="btn header-login-btn" to="/login">
              <FaUserCircle />
              Đăng nhập
            </Link>
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
    </>
  );
}
