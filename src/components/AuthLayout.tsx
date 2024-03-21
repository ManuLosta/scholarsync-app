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
    <div className="md:grid md:grid-cols-2 h-screen">
      <div className="w-full h-screen bg-gradient-to-r from-cyan-500 to-blue-500"></div>
      <div className="flex items-center justify-center flex-col">
        <h2 className="font-bold text-2xl">{title}</h2>
        <p className="font-light mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}
