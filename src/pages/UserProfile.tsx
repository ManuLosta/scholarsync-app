import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Avatar, CircularProgress, Progress } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth.ts';
import FriendStatusButton from '../components/user/FriendStatusButton.tsx';
import { Profile } from '../types/types';
import AddToGroupButton from '../components/user/AddToGroupButton.tsx';
import ChangeProfilePicture from '../components/user/ChangeProfilePicture.tsx';
import UserPlanner from '../components/planner/UserPlanner.tsx';
import { RiCopperCoinFill } from 'react-icons/ri';
import LevelChip from '../components/user/LevelChip.tsx';
import GroupsModal from '../components/user/GroupsModal.tsx';
import FriendsModal from '../components/user/FriendsModal.tsx';

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
    <div className="flex flex-col px-10 mx-auto mt-8">
      <section className="flex gap-8 align-center justify-between">
        <div className="flex gap-3">
          <Avatar
            src={image || ''}
            className="w-[90px] h-[90px] text-large"
            alt="Profile picture"
          />

          <div className="flex flex-col gap-2 justify-center">
            <div className="text-2xl flex gap-4 items-center">
              {UserProfile?.firstName} {UserProfile?.lastName}
              <ChangeProfilePicture profile={UserProfile} setImage={setImage} />
            </div>
            <p className="text-xl text-foreground-400">
              {`@${UserProfile?.username}`}{' '}
            </p>
          </div>
        </div>

        {currentId !== UserProfile?.id && (
          <div className="flex gap-4 items-center">
            <FriendStatusButton userId={UserProfile?.id} myId={currentId} />
            <AddToGroupButton hisId={UserProfile?.id} />
          </div>
        )}
      </section>

      <div className="my-5 flex gap-4 justify-between">
        <div className="flex flex-col gap-2 min-w-[50%]">
          <div className="flex gap-3 items-center">
            <LevelChip level={UserProfile?.level || 'Newbie'} />
            <p>
              {UserProfile?.xp}
              {UserProfile?.nextLevel != 0 && `/${UserProfile?.nextLevel}`}xp
            </p>
          </div>
          <Progress
            aria-label="User xp"
            minValue={UserProfile?.prevLevel}
            maxValue={UserProfile?.nextLevel}
            value={UserProfile?.xp}
          />
        </div>
        <p className="text-xl flex items-center gap-2">
          {UserProfile?.credits}
          <RiCopperCoinFill className="text-yellow-500" />{' '}
        </p>
      </div>

      <div className="flex align-center gap-4">
        <GroupsModal groups={UserProfile?.groups || []} />
        <FriendsModal friends={UserProfile?.friends || []} />
      </div>

      {UserProfile?.friends.find((friend) => friend.id == auth.user?.id) && (
        <section className="my-5">
          <UserPlanner userId={UserProfile?.id} />
        </section>
      )}
    </div>
  );
}
