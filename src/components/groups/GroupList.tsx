import { useEffect, useState } from 'react';
import api from '../../api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { Link, useParams } from 'react-router-dom';
import { User } from '@nextui-org/react';
import CreateGroupModal from './CreateGroupModal.tsx';
import { useNotifications } from '../../hooks/useNotifications.ts';
import GroupListSkeleton from './GroupListSkeleton.tsx';

type Group = {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
};

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications } = useNotifications();
  const auth = useAuth();
  const { groupId } = useParams();

  useEffect(() => {
    fetchGroups(auth?.user?.id);
  }, [auth?.user?.id, notifications]);

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
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-2 flex gap-3 flex-col items-start justify-center">
      <h2 className="font-bold text-lg">Grupos</h2>
      <CreateGroupModal fetchGroups={() => fetchGroups(auth?.user?.id)} />
      {loading ? (
        <>
          <GroupListSkeleton />
          <GroupListSkeleton />
        </>
      ) : (
        groups.map((group) => (
          <Link
            className={`hover:bg-foreground-200 w-full rounded-xl p-2 flex ${groupId == group.id && 'bg-foreground-200'}`}
            to={`/group/${group.id}`}
            key={group.id}
          >
            <User avatarProps={{ color: 'primary' }} name={group.title} />
          </Link>
        ))
      )}
    </div>
  );
}
