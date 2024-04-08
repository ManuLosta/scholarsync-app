import Appbar from './navigation/Appbar.tsx';
import Sidebar from './navigation/Sidebar.tsx';
import React, { useState } from 'react';
import NotificationPanel from './notifications/NotificationPanel.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { CircularProgress } from '@nextui-org/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { loading } = useAuth();

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {loading ? (
        <div className="flex align-center justify-center h-screen w-screen">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-row">
          <div className="flex flex-col w-full">
            <Appbar handleOpen={handleOpen} />
            <div className="flex flex-row">
              <Sidebar />
              {children}
            </div>
          </div>
          <NotificationPanel isOpen={isOpen} handleOpen={handleOpen} />
        </div>
      )}
    </>
  );
}
