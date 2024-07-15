import React, { useEffect, useState } from 'react';
import { Chip, cn, Link, User } from '@nextui-org/react';
import { Profile } from '../../types/types';
import UserPicture from '../user/UserPicture';
import api from '../../api';

interface CustomUserProps {
  chatIdAndUserId: ChatIdAndUserId | undefined;
  statusColor:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  name: string;
}

type ChatIdAndUserId = {
  chatId: string;
  userId: string;
};

const CustomUser: React.FC<CustomUserProps> = ({
  chatIdAndUserId,
  statusColor,
  name,
}) => {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  useEffect(() => {
    function getProfile() {
      api
        .get(`users/profile/` + chatIdAndUserId?.userId)
        .then((res) => {
          const profile: Profile = res.data;
          setProfile(profile);
        })
        .catch((err) => {
          console.error(err);
          return undefined;
        });
    }
    if (chatIdAndUserId !== undefined) {
      getProfile();
    }
  }, [chatIdAndUserId, setProfile]);

  return (
    <div
      aria-label={'Nombre'}
      className={cn(
        'inline-flex max-w-md w-full bg-content1 m-0',
        'hover:bg-content2 items-center justify-start',
        'rounded-lg gap-2 p-4 border-2 border-transparent',
      )}
    >
      <div className="w-full flex justify-between gap-2">
        {chatIdAndUserId === undefined ? (
          <User
            name={name}
            description={'Es un usuario anonimo'}
            key={123}
            avatarProps={{
              src: 'https://static.vecteezy.com/system/resources/previews/032/330/617/original/anonymous-icon-in-trendy-outline-style-isolated-on-white-background-anonymous-silhouette-symbol-for-your-website-design-logo-app-ui-illustration-eps10-free-vector.jpg',
            }}
          />
        ) : (
          <UserPicture
            userId={profile?.id || ''}
            propForUser={{
              name: profile?.firstName || '',
              description: (
                <Link
                  isExternal
                  size="sm"
                  href={`http://localhost:5173/user/` + profile?.id}
                >
                  @{profile?.username}
                </Link>
              ),
              avatarProps: { size: 'md' },
            }}
            hasPicture={profile?.hasPicture || false}
          />
        )}

        {
          <div className="flex flex-col items-end gap-1">
            <span className="text-tiny text-default-500"></span>
            <Chip color={statusColor} size="sm" variant="flat">
              {chatIdAndUserId == undefined ? 'Anónimo' : profile?.level}
            </Chip>
          </div>
        }
      </div>
    </div>
  );
};

export default CustomUser;
