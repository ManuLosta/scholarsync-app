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
    <div className="min-w-[280px] border-foreground-200 flex flex-col p-5 gap-3 rounded-xl m-6">
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
  );
}
