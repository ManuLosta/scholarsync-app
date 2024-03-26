import { useAuth } from '../hooks/useAuth.ts';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout.tsx';

export default function ProtectedRoutes() {
  const auth = useAuth();

  return auth?.sessionId ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
}
