import { Profile } from '../../types/types';
import { Tooltip } from '@nextui-org/react';
import ProfileCard from './ProfileCard.tsx';

export default function UserTooltip({
  user,
  children,
}: {
  user: Profile;
  children: React.ReactNode;
}) {
  return (
    <Tooltip
      delay={500}
      placement="bottom-start"
      content={<ProfileCard user={user} />}
    >
      {children}
    </Tooltip>
  );
}
