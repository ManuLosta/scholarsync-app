import { useAuth } from '../hooks/useAuth.ts';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import { NotificationProvider } from '../context/NotificationContext.tsx';
import { CircularProgress } from '@nextui-org/react';
import { CreditProvider } from '../context/CreditContext.tsx';
import { GroupProvider } from '../context/GroupContext.tsx';
import { FeedProvider } from '../context/FeedContext.tsx';
import { StompSessionProvider } from 'react-stomp-hooks';
import EventModal from '../components/planner/EventModal.tsx';

export default function ProtectedRoutes() {
  const auth = useAuth();

  return auth?.sessionId ? (
    <>
      {auth?.loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <StompSessionProvider url={'ws://localhost:8080/message-broker'}>
          <GroupProvider>
            <NotificationProvider>
              <CreditProvider>
                <FeedProvider>
                  <Layout>
                    <EventModal />
                    <Outlet />
                  </Layout>
                </FeedProvider>
              </CreditProvider>
            </NotificationProvider>
          </GroupProvider>
        </StompSessionProvider>
      )}
    </>
  ) : (
    <Navigate to="/login" />
  );
}
