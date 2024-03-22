import React from 'react';

export default function AuthLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="md:grid md:grid-cols-5 h-screen">
      <div className="md:w-full h-screen bg-gradient-to-r from-secondary-500 to-primary-500 flex items-center justify-center col-span-2"></div>
      <div className="flex items-center justify-center flex-col col-span-3">
        <h2 className="font-bold text-2xl">{title}</h2>
        <p className="font-light mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}
