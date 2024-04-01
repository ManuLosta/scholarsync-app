import Appbar from './navigation/Appbar.tsx';
import Sidebar from './navigation/Sidebar.tsx';
import React from 'react';
import NotificationPanel from './navigation/NotificationPanel.tsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleOpen = () => {setIsOpen(!isOpen)}
  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col w-full">
          <Appbar handleOpen={handleOpen}/>
          <div className="flex flex-row">
            <Sidebar  />
            {children}
          </div>
        </div>
        <NotificationPanel isOpen={isOpen} handleOpen={handleOpen}/>
      </div>
    </>
  );
}
