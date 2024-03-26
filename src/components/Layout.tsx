import Appbar from './navigation/Appbar.tsx';
import Sidebar from './navigation/Sidebar.tsx';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Appbar />
      <div className="flex flex-row">
        <Sidebar />
        {children}
      </div>
    </>
  );
}
