import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readJson('milk_user', null));
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('milk_token')));

  const logout = () => {
    localStorage.removeItem('milk_token');
    localStorage.removeItem('milk_user');
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('milk_token');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get('/auth/profile')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('milk_user', JSON.stringify(res.data));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onLogout = () => logout();
    window.addEventListener('suachimai:logout', onLogout);
    return () => window.removeEventListener('suachimai:logout', onLogout);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('milk_token', res.data.token);
      localStorage.setItem('milk_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = (payload) => api.post('/auth/register', payload);

  const updateProfile = async (payload) => {
    const res = await api.put('/auth/profile', payload);
    localStorage.setItem('milk_user', JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const value = useMemo(() => ({ user, loading, login, register, updateProfile, logout, isAdmin: user?.role === 'admin' }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
