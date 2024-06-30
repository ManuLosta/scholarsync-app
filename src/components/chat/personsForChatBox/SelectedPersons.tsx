import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { Profile } from '../../../types/types';
import { CheckboxGroup } from '@nextui-org/react';
import CustomCheckboxUsers from './CustomCheckBox';
import { useAuth } from '../../../hooks/useAuth';

interface SelectedPersonsProps {
  groupId: string;
  selectedPersons: string[];
  setSelectedPersons: React.Dispatch<React.SetStateAction<string[]>>;
}

interface Group {
  users: Profile[];
}

const SelectedPersons: React.FC<SelectedPersonsProps> = ({
  groupId,
  selectedPersons,
  setSelectedPersons,
}) => {
  const [profiles, SetProfiles] = useState<Profile[]>([]);
  const auth = useAuth();

  useEffect(() => {
    api
      .get(`groups/getGroup?group_id=${groupId}`)
      .then((res) => {
        const data: Group = res.data;
        console.log('la data del get group: ', data);
        SetProfiles(data.users);
      })
      .catch((err) => {
        console.error('Error fetching group info: ', err);
      });
  }, [groupId]);

  useEffect(() => {
    console.log(selectedPersons);
  }, [selectedPersons]);

  return (
    <>
      <div className="flex flex-col gap-1 w-full">
        <CheckboxGroup
          label="Select employees"
          value={selectedPersons}
          onChange={setSelectedPersons}
          classNames={{
            base: 'w-full',
          }}
        >
          {profiles.map(
            (person) =>
              person.id !== auth.user?.id && (
                <CustomCheckboxUsers
                  key={person.id}
                  user={person}
                  statusColor="secondary"
                  value={person.id}
                />
              ),
          )}
        </CheckboxGroup>
      </div>
    </>
  );
};

export default SelectedPersons;
