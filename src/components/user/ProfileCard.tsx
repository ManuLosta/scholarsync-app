import { Level, Profile } from '../../types/types';
import { Chip, Progress, User } from '@nextui-org/react';
import { Link } from 'react-router-dom';

interface LevelStyle {
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  classNames?: { base: string };
}

export default function ProfileCard({ user }: { user: Profile }) {
  const levelStyles: Record<Level, LevelStyle> = {
    Newbie: { color: 'default' },
    Learner: { color: 'primary' },
    Initiate: { color: 'secondary' },
    Contender: { color: 'success' },
    Skilled: { color: 'warning' },
    Veteran: { color: 'danger' },
    Master: {
      classNames: {
        base: 'bg-gradient-to-br from-primary to-secondary text-white',
      },
    },
    Grand_Master: {
      classNames: {
        base: 'bg-gradient-to-br from-secondary to-success text-white',
      },
    },
    Champion: {
      classNames: {
        base: 'bg-gradient-to-br from-success to-warning text-white',
      },
    },
    Legend: {
      classNames: {
        base: 'bg-gradient-to-br from-warning to-danger text-white',
      },
    },
  };

  const getLevelChip = (level: Level) => {
    const style = levelStyles[level];
    if (!style) {
      return <Chip>Unknown</Chip>;
    }

    return <Chip {...style}>{level}</Chip>;
  };

  return (
    <Link
      to={`/user/${user.id}`}
      className="flex flex-col items-start gap-3 p-2"
    >
      <User
        classNames={{ base: 'w-full justify-start' }}
        name={`${user.firstName} ${user.lastName}`}
        description={`@${user.username}`}
      />
      {getLevelChip(user.level as Level)}
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
