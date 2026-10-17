import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('milk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');
    if (status === 401 && !isAuthCall && localStorage.getItem('milk_token')) {
      localStorage.removeItem('milk_token');
      localStorage.removeItem('milk_user');
      window.dispatchEvent(new Event('suachimai:logout'));
    }
    return Promise.reject(error.response?.data || { message: 'Không thể kết nối máy chủ' });
  }
);

export const imageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80';
  return url.startsWith('http') ? url : `${API_URL}${url}`;
};

export default api;
