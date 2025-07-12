import { Navigate } from 'react-router-dom';
import { getUser } from '../auth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = getUser();
  if (!user) return <Navigate to="/" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}