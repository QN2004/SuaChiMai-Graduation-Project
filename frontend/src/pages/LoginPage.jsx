import { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = location.pathname.startsWith('/admin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  useDocumentMeta({
    title: isAdminLogin
      ? 'Đăng nhập quản trị | Sữa Chi Mai'
      : 'Đăng nhập | Sữa Chi Mai',
    favicon: isAdminLogin ? '/favicon-admin.ico' : '/favicon.ico'
  });

  const submit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form.email, form.password);
      const from = location.state?.from;
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const target = from?.pathname && !from.pathname.startsWith('/admin') ? from.pathname : '/';
        navigate(target, { replace: true, state: from?.state });
      }
    } catch (err) {
      setMessage(err.message || 'Không thể đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <AuthForm
      title={isAdminLogin ? 'Đăng nhập quản trị' : 'Đăng nhập'}
      message={message}
      form={form}
      setForm={setForm}
      submit={submit}
      button="Đăng nhập"
      footer={<p>Chưa có tài khoản? <Link to="/register" state={location.state}>Đăng ký</Link></p>}
    />
  );
}

export function AuthForm({ title, message, form, setForm, submit, button, register = false, footer }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-card-heading">
          <h1>{title}</h1>
        </div>
        {message && <div className="alert">{message}</div>}
        {register && (
          <label className="auth-field">
            <span>Họ và tên</span>
            <div className="auth-input-wrap">
              <FaUser />
              <input
                required
                placeholder="Nhập họ và tên"
                autoComplete="name"
                value={form.full_name}
                onChange={(event) => setForm({ ...form, full_name: event.target.value })}
              />
            </div>
          </label>
        )}
        {register && (
          <label className="auth-field">
            <span>Số điện thoại</span>
            <div className="auth-input-wrap">
              <FaPhoneAlt />
              <input
                required
                type="tel"
                inputMode="tel"
                placeholder="Nhập số điện thoại"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </div>
          </label>
        )}
        <label className="auth-field">
          <span>Email</span>
          <div className="auth-input-wrap">
            <FaEnvelope />
            <input
              required
              type="email"
              placeholder="Nhập email"
              autoComplete="username"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </div>
        </label>
        <label className="auth-field">
          <span>Mật khẩu</span>
          <div className="auth-input-wrap auth-password-wrap">
            <FaLock />
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              autoComplete={register ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <button
              className="auth-password-toggle"
              type="button"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>
        <button className="btn primary full auth-submit" type="submit">{button}</button>
        <div className="auth-footer">{footer}</div>
      </form>
    </section>
  );
}
