import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('milk_user') || 'null'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('milk_token');
    if (!token) return;
    api.get('/auth/profile')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('milk_user', JSON.stringify(res.data));
      })
      .catch(() => logout());
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

  const logout = () => {
    localStorage.removeItem('milk_token');
    localStorage.removeItem('milk_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, updateProfile, logout, isAdmin: user?.role === 'admin' }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
