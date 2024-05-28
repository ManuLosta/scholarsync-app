import { useAuth } from '../../hooks/useAuth.ts';
import { Link, useParams } from 'react-router-dom';
import { User } from '@nextui-org/react';
import CreateGroupModal from './CreateGroupModal.tsx';
import GroupListSkeleton from './GroupListSkeleton.tsx';
import { useGroups } from '../../hooks/useGroups.ts';

export default function GroupList() {
  const auth = useAuth();
  const { groupId } = useParams();
  const { groups, fetchGroupsforProfile, loading } = useGroups();

  return (
    <div className="mt-2 flex gap-3 flex-col items-start justify-center">
      <h2 className="font-bold text-lg">Grupos</h2>
      <CreateGroupModal
        fetchGroups={() => fetchGroupsforProfile(auth?.user?.id)}
      />
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
