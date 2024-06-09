import React from 'react';
import { Card, CardHeader, CardBody, Divider, Chip } from '@nextui-org/react';
import { Group } from '../../../types/types';
import GroupUserPicture from '../../groups/GroupPicture';
import { Link } from 'react-router-dom';

type GroupCardProps = {
  group: Group | null;
};

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  console.log(group);
  return group != undefined && group != null ? (
    <Link to={`/group/${group.id}`}>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <GroupUserPicture
            groupId={group.id}
            propForUser={{ name: '' }}
            hasPicture={group.hasPicture}
          ></GroupUserPicture>
          <div className="flex flex-col">
            <p className="text-md">{group.title}</p>
            <p className="text-small text-default-500">{group.description}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Chip>
            <p>{group.isPrivate ? 'Privado ' : 'Publico'}</p>
          </Chip>
        </CardBody>
        <Divider />
      </Card>
    </Link>
  ) : null;
};

export default GroupCard;
