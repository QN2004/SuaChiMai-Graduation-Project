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
  (error) => Promise.reject(error.response?.data || { message: 'Khong the ket noi may chu' })
);

export const imageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80';
  return url.startsWith('http') ? url : `${API_URL}${url}`;
};

export default api;
