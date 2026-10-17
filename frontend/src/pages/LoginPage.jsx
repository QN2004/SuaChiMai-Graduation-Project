import { useState } from 'react';
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
      const from = location.state?.from?.pathname;
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from && !from.startsWith('/admin') ? from : '/', { replace: true });
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
      footer={<p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>}
    />
  );
}

export function AuthForm({ title, message, form, setForm, submit, button, register = false, footer }) {
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>{title}</h1>
        {message && <div className="alert">{message}</div>}
        {register && (
          <input
            required
            placeholder="Họ tên"
            value={form.full_name}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
          />
        )}
        {register && (
          <input
            required
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        )}
        <input
          required
          type="email"
          placeholder="Nhập email"
          autoComplete="username"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <button className="btn primary full">{button}</button>
        {footer}
      </form>
    </section>
  );
}
