import Appbar from './navigation/Appbar.tsx';
import Sidebar from './navigation/Sidebar.tsx';
import React, { useState } from 'react';
import NotificationPanel from './notifications/NotificationPanel.tsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col relative">
        <Appbar handleOpen={handleOpen} />
        <div className="grid grid-cols-12">
          <Sidebar />
          {children}
      </div>
      <NotificationPanel isOpen={isOpen} handleOpen={handleOpen} />
    </div>
  );
}
