import React from 'react';
import { Chip, cn, Link, User } from '@nextui-org/react';
import { Profile } from '../types/types';
import UserPicture from '../components/user/UserPicture';

interface CustomUserProps {
  user: Profile;
  statusColor:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  isAnonymous: boolean;
}

const CustomUser: React.FC<CustomUserProps> = ({
  user,
  statusColor,
  isAnonymous,
}) => {
  return (
    <div
      aria-label={user.firstName}
      className={cn(
        'inline-flex max-w-md w-full bg-content1 m-0',
        'hover:bg-content2 items-center justify-start',
        'rounded-lg gap-2 p-4 border-2 border-transparent',
      )}
    >
      <div className="w-full flex justify-between gap-2">
        {isAnonymous ? (
          <User
            name={user.username}
            description={'Es un usuario anonimo'}
            key={123}
            avatarProps={{
              src: 'https://static.vecteezy.com/system/resources/previews/032/330/617/original/anonymous-icon-in-trendy-outline-style-isolated-on-white-background-anonymous-silhouette-symbol-for-your-website-design-logo-app-ui-illustration-eps10-free-vector.jpg',
            }}
          />
        ) : (
          <UserPicture
            userId={user.id}
            propForUser={{
              name: user.firstName,
              description: (
                <Link
                  isExternal
                  size="sm"
                  href={`http://localhost:5173/user/` + user.id}
                >
                  @{user.username}
                </Link>
              ),
              avatarProps: { size: 'md' },
            }}
            hasPicture={user.hasPicture}
          />
        )}

        {
          <div className="flex flex-col items-end gap-1">
            <span className="text-tiny text-default-500"></span>
            <Chip color={statusColor} size="sm" variant="flat">
              {isAnonymous ? 'Anonymous' : user.level}
            </Chip>
          </div>
        }
      </div>
    </div>
  );
};

export default CustomUser;
