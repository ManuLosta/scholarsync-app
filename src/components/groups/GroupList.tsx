import { Link, useParams } from 'react-router-dom';
import CreateGroupModal from './CreateGroupModal.tsx';
import GroupListSkeleton from './GroupListSkeleton.tsx';
import GroupUserPicture from './GroupPicture.tsx';
import { UserProps } from '@nextui-org/react';
import { useGroups } from '../../hooks/useGroups.ts';

export default function GroupList() {
  const { groupId } = useParams();
  const { groups, fetchGroupsforProfile, loading } = useGroups();

  return (
    <div className="mt-2 flex gap-3 flex-col items-start justify-center">
      <h2 className="font-bold text-lg">Grupos</h2>
      <CreateGroupModal fetchGroups={() => fetchGroupsforProfile()} />
      {loading ? (
        <>
          <GroupListSkeleton />
          <GroupListSkeleton />
        </>
      ) : (
        groups.map((group) => {
          const userProps: UserProps = {
            name: group.title,
            avatarProps: {
              color: 'primary',
            },
          };

          return (
            <Link
              className={`hover:bg-foreground-200 w-full rounded-xl p-2 flex items-center ${groupId === group.id && 'bg-foreground-200'}`}
              to={`/group/${group.id}`}
              key={group.id}
            >
              <GroupUserPicture
                groupId={group.id}
                propForUser={userProps}
                hasPicture={group.hasPicture}
              />
            </Link>
          );
        })
      )}
    </div>
  );
}
