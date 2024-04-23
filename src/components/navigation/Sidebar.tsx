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
    <div className="col-span-3 block relative overflow-visible">
      <div className="overflow-auto fixed flex flex-col gap-4 px-8 pt-2 pb-8 h-[calc(100vh-64px)]">
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
