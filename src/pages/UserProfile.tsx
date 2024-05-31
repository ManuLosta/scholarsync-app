import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Avatar, Chip, CircularProgress } from '@nextui-org/react';

import { useAuth } from '../hooks/useAuth.ts';
import FriendStatusButton from '../components/FriendStatusButton.tsx';

import { Profile } from '../types/types';
import AddToGroupButton from '../components/AddToGroupButton.tsx';
import ChangeProfilePicture from '../components/ChangeProfilePicture.tsx';

export default function UserProfile() {
  const { id } = useParams();
  const [UserProfile, setUserProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const [image, setImage] = useState<string>('');
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
          src={image || ''}
          className="w-20 h-20 text-large"
          alt="Profile picture"
        />

        <div className="flex gap-4 flex-col">
          <p className="text-2xl flex  gap-4 ">
            {UserProfile?.firstName} {UserProfile?.lastName}
            <ChangeProfilePicture profile={UserProfile} setImage={setImage} />
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
        <div className="flex gap-4 max-w-[500px] flex-wrap">
          {UserProfile?.groups.map((group) => (
            <Chip key={group.id} color="primary" variant="bordered">
              {group.title}
            </Chip>
          ))}
        </div>
      </div>

      {currentId !== UserProfile?.id && (
        <div className="flex gap-4">
          <FriendStatusButton userId={UserProfile?.id} myId={currentId} />
          <AddToGroupButton hisId={UserProfile?.id} />
        </div>
      )}
    </div>
  );
}
