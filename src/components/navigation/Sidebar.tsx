import { LuCalendar, LuHome } from 'react-icons/lu';
import NavItem from './NavItem.tsx';
import CreateGroupModal from '../CreateGroupModal.tsx';

const navItems = [
  {
    name: 'Inicio',
    path: '/',
    icon: <LuHome size={25} />,
  },
  {
    name: 'Planner',
    path: '/planner',
    icon: <LuCalendar size={25} />,
  },
];

export default function Sidebar() {
  return (
    <div className="min-w-[280px] border-foreground-200 flex flex-col p-5 gap-3 rounded-xl bg-foreground-50 m-6">
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          name={item.name}
          path={item.path}
          icon={item.icon}
        />
      ))}
      <div className="mt-2 flex gap-3 flex-col items-start">
        <h2 className="text">Mis grupos</h2>
        <CreateGroupModal />
      </div>
    </div>
  );
}
