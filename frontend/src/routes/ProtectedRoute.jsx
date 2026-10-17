import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user) {
    return <Navigate to={admin ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }
  if (admin && user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
