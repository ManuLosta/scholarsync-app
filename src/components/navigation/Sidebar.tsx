import { LuCalendar, LuHome } from 'react-icons/lu';
import NavItem from './NavItem.tsx';
import CreateGroupModal from '../groups/CreateGroupModal.tsx';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { User } from '@nextui-org/react';
import { Link } from 'react-router-dom';

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

type Group = {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
};

export default function Sidebar() {
  const [groups, setGroups] = useState<Group[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/groups/getGroups?user_id=${user?.id}`,
        );

        if (res.ok) {
          const data = await res.json();
          setGroups(data);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [user?.id]);

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
      <div className="mt-2 flex gap-3 flex-col items-start justify-center">
        <h2 className="text">Mis grupos</h2>
        {groups.map((group) => (
          <Link
            className="hover:bg-foreground-200 w-full rounded-xl p-2 flex"
            to={`/group/${group.id}`}
            key={group.id}
          >
            <User avatarProps={{ color: 'primary' }} name={group.title} />
          </Link>
        ))}
        <CreateGroupModal />
      </div>
    </div>
  );
}
