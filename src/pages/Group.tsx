import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api.ts';
import { Avatar, Skeleton } from '@nextui-org/react';

type Group = {
  title: string;
  description: string;
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
    <div className="container mt-8">
      <div className="flex gap-4 items-center">
        <Avatar className="w-[90px] h-[90px] text-2xl" name={group?.title} color="primary" />
        <div>
          <h1 className="font-bold text-3xl">{group?.title}</h1>
          <p className="text-xl font-light">{group?.description}</p>
          <p className="font-light">{group?.users?.length} {
            (group?.users?.length != undefined && group?.users?.length > 1) ? "miembros" : "miembro"
          }</p>
        </div>
      </div>
    </div>
  )
}