import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Chip, CircularProgress } from '@nextui-org/react';

import { useAuth } from '../hooks/useAuth.ts';
import FriendStatusButton from '../components/FriendStatusButton.tsx';
import { Avatar } from '@nextui-org/react';
import { Profile } from '../types/types';
import AddToGroupButton from '../components/AddToGroupButton.tsx';

export default function UserProfile() {
  const { id } = useParams();
  const [UserProfile, setUserProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const currentId = auth?.user?.id;

  useEffect(() => {
    api
      .get(`users/profile/${id}`)
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return loading ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <div className="flex gap-8 flex-col justify-start align-center ml-20 mt-9">
      <div className="flex gap-8 align-center">
        <Avatar
          name={`${UserProfile?.firstName}`}
          className="w-20 h-20 text-large"
          //description={`@${UserProfile?.username}`}
        />
        <div className="flex gap-4 flex-col">
          <p className="text-2xl">
            {UserProfile?.firstName} {UserProfile?.lastName}
          </p>
          <p className="text-xl text-foreground-400">
            {`@${UserProfile?.username}`}{' '}
          </p>
          <Chip color="primary">{UserProfile?.level}</Chip>
        </div>
      </div>

      <div className="flex gap-9 align-center">
        <p className="text-xl">Puntos: {UserProfile?.credits?.toString()}</p>
        <p className="text-xl">
          Amigos: {UserProfile?.friends?.length?.toString()}
        </p>
      </div>
      <div className="flex align-center gap-4">
        <p className="text-xl">Grupos:</p>
        <div className="flex gap-4">
          {UserProfile?.groups.map((group) => (
            <Chip key={group.id} color="primary" variant="bordered">
              {group.title}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <FriendStatusButton userId={UserProfile?.id} myId={currentId} />
        <AddToGroupButton hisId={UserProfile?.id} />
      </div>
    </div>
  );
}
