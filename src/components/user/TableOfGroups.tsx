import React from 'react';
import { CheckboxGroup } from '@nextui-org/react';
import CustomCheckbox from './CustomCheckBox.tsx';

interface Group {
  createdBy: string;
  description: string;
  id: string;
  isPrivate: boolean;
  title: string;
}

// Define the properties for the GroupCheckboxes component
interface GroupCheckboxesProps {
  groups: Group[];
  groupSelected: string[];
  setGroupSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const GroupCheckboxes: React.FC<GroupCheckboxesProps> = ({
  groups,
  groupSelected,
  setGroupSelected,
}) => {
  console.log(groups);

  const getSelectedGroupTitles = (
    selectedGroupIds: string[],
    groups: Group[],
  ): string[] => {
    return selectedGroupIds.map((groupId) => {
      const selectedGroup = groups.find((group) => group.id === groupId);
      return selectedGroup ? selectedGroup.title : ''; // Si no se encuentra el grupo, devuelve una cadena vacía
    });
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <CheckboxGroup
        label="Groups:"
        value={groupSelected}
        onChange={setGroupSelected}
        classNames={{
          base: 'w-full',
        }}
      >
        {' '}
        <div className="flex gap-5 flex-col">
          {groups.map((group) => (
            <CustomCheckbox
              key={group.id}
              value={group.id}
              user={{
                name: group.title,
                avatar:
                  'https://t4.ftcdn.net/jpg/02/01/10/87/360_F_201108775_UMAoFXBAsSKNcr53Ip5CTSy52Ajuk1E4.jpg',
                username: group.title.substring(0, 20) + '...',
                url: 'http://localhost:5173/group/' + group.id,
                role: group.description.substring(0, 20) + '...',
                status: group.isPrivate ? 'Private' : 'Public',
              }}
              statusColor={group.isPrivate ? 'danger' : 'secondary'}
            />
          ))}
        </div>
      </CheckboxGroup>
      <p className="mt-4 ml-1 text-default-500">
        Selected: {getSelectedGroupTitles(groupSelected, groups).join(', ')}
      </p>
    </div>
  );
};

export default GroupCheckboxes;
