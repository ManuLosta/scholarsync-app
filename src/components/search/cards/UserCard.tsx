import React from 'react';
import { Card, CardHeader, CardBody, Divider, Link } from '@nextui-org/react';
import UserPicture from '../../user/UserPicture';
import { Profile } from '../../../types/types';

type UserCardProps = {
  profile: Profile | null;
};

const UserCard: React.FC<UserCardProps> = ({ profile }) => {
  return profile ? (
    <div>
      <Link href={`/user/${profile.id}`}>
        <Card className="min-w-[300px] ">
          <CardHeader className="flex gap-3">
            <UserPicture
              userId={profile.id}
              propForUser={{ name: '' }}
              hasPicture={profile.hasPicture}
            ></UserPicture>
            <div className="flex flex-col">
              <p className="text-md">{`${profile.firstName} ${profile.lastName}`}</p>
              <p className="text-small text-default-500">@{profile.username}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>Credits: {profile.credits}</p>
            <p>
              Level: {profile.level} (XP: {profile.xp})
            </p>
          </CardBody>
          <Divider />
        </Card>
      </Link>
    </div>
  ) : null;
};

export default UserCard;
