import { useEffect, useState } from 'react';
import api from '../../api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { Link } from 'react-router-dom';
import { User } from '@nextui-org/react';
import CreateGroupModal from './CreateGroupModal.tsx';

type Group = {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
};

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    fetchGroups(auth?.user?.id)
  }, [auth?.user?.id]);

  const fetchGroups = (userId: string | undefined) => {
    setLoading(true);
    api
      .get(`groups/getGroups?user_id=${userId}`)
      .then((res) => {
        const data = res.data;
        setGroups(data);
      })
      .catch((err) => {
        console.error('Error fetching groups', err);
      }).finally(() => setLoading(false));
  }

  return (
    <div className="mt-2 flex gap-3 flex-col items-start justify-center">
      <h2 className="text">Mis grupos</h2>
      {loading ? (
        <div>
          Loading
        </div>
      ) : groups.map((group) => (
        <Link
          className="hover:bg-foreground-200 w-full rounded-xl p-2 flex"
          to={`/group/${group.id}`}
          key={group.id}
        >
          <User avatarProps={{ color: 'primary' }} name={group.title} />
        </Link>
      ))}
      <CreateGroupModal fetchGroups={() => fetchGroups(auth?.user?.id)} />
    </div>

  )
}