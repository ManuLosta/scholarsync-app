import { Chip } from '@nextui-org/react';
import { Level } from '../../types/types';

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

export default function LevelChip({ level }: { level: Level }) {
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

  const style = levelStyles[level];

  if (!style) {
    return <Chip>Unknown</Chip>;
  }

  return <Chip {...style}>{level}</Chip>;
}
