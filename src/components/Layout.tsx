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
    <div className="container mx-auto flex flex-col relative max-w-[1280px]">
      <Appbar handleOpen={handleOpen} />
      <Sidebar />
      <div className="ms-[20rem]">{children}</div>
      <NotificationPanel isOpen={isOpen} handleOpen={handleOpen} />
    </div>
  );
}
