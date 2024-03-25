import { useAuth } from '../hooks/useAuth.ts';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoutes() {
  const auth = useAuth();

  return auth?.sessionId ? <Outlet /> : <Navigate to="/login" />;
}
