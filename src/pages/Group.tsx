import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api.ts';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import MemberList from '../components/groups/MemberList.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import InviteToGroup from '../components/groups/InviteToGroup.tsx';

type Group = {
  createdBy: string;
  title: string;
  description: string;
  isPrivate: boolean;
  invitations: {
    user_id: string
  }[],
  users: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }[];
}

export default function Group() {
  const { groupId } = useParams();
  const [ group, setGroup ] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`groups/getGroup?group_id=${groupId}`)
      .then(res => {
        const data = res.data;
        console.log(data)
        setGroup(data);
      })
      .catch(err => {
        console.error("Error fetching group info: ", err)
      })
      .finally(() => setLoading(false))
  }, [groupId]);

  return loading ? (
    <div className="container mt-8">
      <div className="flex gap-4 items-center">
        <Skeleton className="w-[80px] h-[80px] rounded-full" />
        <div>
          <Skeleton className="h-6 w-[200px] rounded-lg mb-2" />
          <Skeleton className="h-4 w-[200px] rounded-lg mb-2"  />
          <Skeleton className="h-3 w-[200px] rounded-lg" />
        </div>
      </div>
    </div>
    ) : (
    <div className="container mt-8 px-8">
      <div className="flex gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-[90px] h-[90px] text-2xl" name={group?.title} color="primary" />
          <div className="max-w-[400px]">
            <h1 className="font-bold text-3xl">{group?.title}</h1>
            <p className="text-xl font-light">{group?.description}</p>
            <MemberList users={group?.users} />
          </div>
        </div>
        <div>
          {(group?.createdBy == user?.id || !group?.isPrivate) && (
            <InviteToGroup groupId={groupId || ""} members={group?.users || []} invitations={group?.invitations || []} />
          )}
          {group?.users.some(u => u.id == user?.id && u.id != group?.createdBy) && (
            <Button>Dejar</Button>
          )}
        </div>
      </div>
    </div>
  )
}