import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from './LoginPage';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setMessage(err.message);
    }
  };
  return <AuthForm title="Đăng ký tài khoản" message={message} form={form} setForm={setForm} submit={submit} button="Tạo tài khoản" register footer={<p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>} />;
}
