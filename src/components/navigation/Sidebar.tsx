import { LuCalendar, LuHome } from 'react-icons/lu';
import NavItem from './NavItem.tsx';
import GroupList from '../groups/GroupList.tsx';

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
    <div className="overflow-auto h-[calc(100vh-120px)] p-6 min-w-[20rem] mt-[5rem] fixed bg-foreground-50 rounded-2xl">
      <div className="flex flex-col gap-3">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            name={item.name}
            path={item.path}
            icon={item.icon}
          />
        ))}
        <GroupList />
      </div>
    </div>
  );
}
