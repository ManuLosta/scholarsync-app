import React from 'react';
import { Profile } from '../../../types/types';
import { Checkbox, Chip, Link, cn } from '@nextui-org/react';
import UserPicture from '../../user/UserPicture';

interface CustomCheckboxUsersProps {
  user: Profile;
  value: string;
  statusColor:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
}

const CustomCheckboxUsers: React.FC<CustomCheckboxUsersProps> = ({
  user,
  statusColor,
  value,
}) => {
  return (
    <Checkbox
      aria-label={user.firstName}
      classNames={{
        base: cn(
          'inline-flex max-w-md w-full bg-content1 m-0',
          'hover:bg-content2 items-center justify-start',
          'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary',
        ),
        label: 'w-full',
      }}
      value={value}
    >
      <div className="w-full flex justify-between gap-2">
        <UserPicture
          userId={''}
          propForUser={{
            name: user.firstName,
            description: (
              <Link isExternal href={`user/${user.id}`} size="sm">
                @{user.username}
              </Link>
            ),
            avatarProps: { size: 'md' },
          }}
          hasPicture={user.hasPicture}
        ></UserPicture>

        <div className="flex flex-col items-end gap-1">
          <span className="text-tiny text-default-500"></span>
          <Chip color={statusColor} size="sm" variant="flat">
            {user.level}
          </Chip>
        </div>
      </div>
    </Checkbox>
  );
};

export default CustomCheckboxUsers;
