import { Profile } from '../../types/types';
import { Progress } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import UserPicture from './UserPicture.tsx';
import LevelChip from './LevelChip.tsx';

export default function ProfileCard({ user }: { user: Profile }) {
  return (
    <Link
      to={`/user/${user.id}`}
      className="flex flex-col items-start gap-3 p-2"
    >
      <UserPicture
        userId={user.id}
        propForUser={{
          name: `${user.firstName} ${user.lastName}`,
          description: `@${user.username}`,
          className: 'w-full justify-start',
        }}
        hasPicture={user.hasPicture}
      />
      <LevelChip level={user.level} />
      <div className="w-full">
        {user.xp}
        {user.nextLevel != 0 && `/${user.nextLevel}`}xp
        <Progress
          aria-label="User xp"
          minValue={user.prevLevel}
          maxValue={user.nextLevel}
          value={user.xp}
        />
      </div>
      <div className="flex gap-2">
        <p>
          <span className="font-bold">{user.questions}</span> <br />{' '}
          <span className="font-light">preguntas</span>
        </p>
        <p>
          <span className="font-bold">{user.answers}</span> <br />{' '}
          <span className="font-light">respuestas</span>
        </p>
      </div>
    </Link>
  );
}
