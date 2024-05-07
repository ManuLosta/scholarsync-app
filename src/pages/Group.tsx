import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api.ts';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import MemberList from '../components/groups/MemberList.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import InviteToGroup from '../components/groups/InviteToGroup.tsx';
import { LuLock } from 'react-icons/lu';
import { useNotifications } from '../hooks/useNotifications.ts';
import { GroupInvite } from '../types/types';
import CreatePostButton from '../components/post/CreatePostButton.tsx';

type Group = {
  createdBy: string;
  title: string;
  description: string;
  isPrivate: boolean;
  invitations: {
    user_id: string;
  }[];
  users: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }[];
};

export default function Group() {
  const { groupId } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState<boolean>(false);
  const { user } = useAuth();
  const { notifications, acceptGroupInvite, rejectGroupInvite } =
    useNotifications();
  const notificationId = notifications.find((notification) => {
    if (notification.notificationType == 'GROUP_INVITE') {
      return (notification as GroupInvite).group_id == groupId;
    }
  })?.notification_id;

  useEffect(() => {
    api
      .get(`groups/getGroup?group_id=${groupId}`)
      .then((res) => {
        const data = res.data;
        setGroup(data);
        setIsMember(
          data.users.some((u: { id: string | undefined }) => u.id == user?.id),
        );
      })
      .catch((err) => {
        console.error('Error fetching group info: ', err);
      })
      .finally(() => setLoading(false));
  }, [group?.createdBy, groupId, user?.id, isMember]);

  const handleLeave = () => {
    api
      .post('groups/remove-user-from-group', {
        group_id: groupId,
        user_id: user?.id,
      })
      .then(() => setIsMember(false))
      .catch((err) => console.error('Error leaving group: ', err));
  };

  const handleJoin = () => {
    api
      .post('groups/join-group', {
        group_id: groupId,
        user_id: user?.id,
      })
      .then(() => setIsMember(true))
      .catch((err) => console.error(err));
  };

  return loading ? (
    <div className="container mt-8 col-span-9">
      <div className="flex gap-4 items-center">
        <Skeleton className="w-[80px] h-[80px] rounded-full" />
        <div>
          <Skeleton className="h-6 w-[200px] rounded-lg mb-2" />
          <Skeleton className="h-4 w-[200px] rounded-lg mb-2" />
          <Skeleton className="h-3 w-[200px] rounded-lg" />
        </div>
      </div>
    </div>
  ) : (
    <div className="container mt-8 px-8 col-span-9">
      <div className="flex gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            className="w-[90px] h-[90px] text-2xl"
            name={group?.title}
            color="primary"
          />
          <div className="max-w-[400px]">
            <h1 className="font-bold text-3xl flex items-center">
              {group?.title}
              {group?.isPrivate && (
                <span className="ms-2">
                  <LuLock />
                </span>
              )}
            </h1>
            <p className="text-xl font-light">{group?.description}</p>
            <MemberList users={group?.users} />
          </div>
        </div>
        <div className="flex gap-2">
          {(group?.createdBy == user?.id ||
            (isMember && !group?.isPrivate)) && (
            <InviteToGroup
              groupId={groupId || ''}
              members={group?.users || []}
              invitations={group?.invitations || []}
            />
          )}
          {isMember && group?.createdBy != user?.id && (
            <Button onPress={handleLeave} color="danger" variant="ghost">
              Dejar
            </Button>
          )}
          {!isMember && !group?.isPrivate && !notificationId && (
            <Button onPress={handleJoin} color="primary">
              Unirse
            </Button>
          )}
          {notificationId && (
            <>
              <Button onPress={() => rejectGroupInvite(notificationId)}>
                Rechazar
              </Button>
              <Button
                onPress={() => {
                  acceptGroupInvite(notificationId);
                  setIsMember(true);
                }}
                color="primary"
              >
                Aceptar Invitación
              </Button>
            </>
          )}
        </div>
      </div>
      <CreatePostButton />
    </div>
  );
}
