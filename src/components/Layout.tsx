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
    <div className="lg:container mx-auto flex flex-col relative">
      <Appbar handleOpen={handleOpen} />
      <div className="w-full lg:container lg:mx-auto lg:grid lg:grid-cols-12 flex flex-row mt-6">
        <Sidebar />
        {children}
      </div>
      <NotificationPanel isOpen={isOpen} handleOpen={handleOpen} />
    </div>
  );
}
