import React from 'react';
import { Checkbox, Link, User as NextUser, Chip, cn } from '@nextui-org/react';

// Define the User interface
interface User {
  name: string;
  avatar: string;
  username: string;
  url: string;
  role: string;
  status: string;
}

// Define the properties for the CustomCheckbox component
interface CustomCheckboxProps {
  user: User;
  value: string;
  statusColor:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  isSelected?: boolean;
  onValueChange?: (selected: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  user,
  value,
  statusColor,
  isSelected = false,
  onValueChange,
}) => {
  return (
    <Checkbox
      aria-label={user.name}
      value={value}
      classNames={{
        base: cn(
          'inline-flex w-full max-w-md bg-content1',
          'hover:bg-content2 items-center justify-start',
          'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary',
        ),
        label: 'w-full',
      }}
      isSelected={isSelected}
      onValueChange={onValueChange}
    >
      <div className="w-full flex justify-between gap-2">
        <NextUser
          avatarProps={{ size: 'md', src: user.avatar }}
          description={
            <Link isExternal href={user.url} size="sm">
              @{user.username}
            </Link>
          }
          name={user.name}
        />
        <div className="flex flex-col items-end gap-1">
          <span className="text-tiny text-default-500">{user.role}</span>
          <Chip color={statusColor} size="sm" variant="flat">
            {user.status}
          </Chip>
        </div>
      </div>
    </Checkbox>
  );
};
export default CustomCheckbox;
