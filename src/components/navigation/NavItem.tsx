import React from 'react';
import { Link } from 'react-router-dom';

export default function NavItem({
  name,
  path,
  icon,
}: {
  name: string;
  path: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      className="flex items-center justify-start gap-2 p-2 rounded-lg hover:bg-foreground-200 transition-colors duration-200 ease-in-out"
      to={path}
    >
      {icon}
      <p className="ms-1">{name}</p>
    </Link>
  );
}
