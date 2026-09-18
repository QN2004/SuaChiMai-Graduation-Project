import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@suachimai.vn', password: 'Admin@123' });
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setMessage(err.message || 'Không thể đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <AuthForm
      title="Đăng nhập"
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
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <button className="btn primary full">{button}</button>
        {footer}
      </form>
    </section>
  );
}
