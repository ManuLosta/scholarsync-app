import { useAuth } from '../hooks/useAuth.ts';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import { NotificationProvider } from '../context/NotificationContext.tsx';
import { CircularProgress } from '@nextui-org/react';
import { CreditProvider } from '../context/CreditContext.tsx';
import { FeedProvider } from '../context/FeedContext.tsx';

export default function ProtectedRoutes() {
  const auth = useAuth();

  return auth?.sessionId ? (
    <>
      {auth?.loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <NotificationProvider>
          <CreditProvider>
            <FeedProvider>
              <Layout>
                <Outlet />
              </Layout>
            </FeedProvider>
          </CreditProvider>
        </NotificationProvider>
      )}
    </>
  ) : (
    <Navigate to="/login" />
  );
}
