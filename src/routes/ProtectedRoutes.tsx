import { useAuth } from '../hooks/useAuth.ts';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import { NotificationProvider } from '../context/NotificationContext.tsx';

export default function ProtectedRoutes() {
  const auth = useAuth();

  return auth?.sessionId ? (
    <NotificationProvider>
      <Layout>
        <Outlet />
      </Layout>
    </NotificationProvider>
  ) : (
    <Navigate to="/login" />
  );
}
