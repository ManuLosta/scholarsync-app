import { useCallback, useEffect, useState } from 'react';
import CustomTabs from './CustomTabs';

import { Input } from '@nextui-org/react';
import { LuSearch } from 'react-icons/lu';
import { Group, Profile, Question } from '../../types/types';
import api from '../../api';

export default function SearchPage() {
  const [groupResult, setGroupResult] = useState<Group[]>([]);
  const [userResult, setUserResult] = useState<Profile[]>([]);
  const [questionResult, setQuestionResult] = useState<Question[]>([]);
  const [thingToSearch, setThingToSearch] = useState<string>('');
  const [categoryForSerch, setCategoryForSerch] = useState<string>('user');

  const serch = useCallback(async () => {
    if (thingToSearch != '') {
      try {
        const response = await api.get(`/groups/get-picture`, {
          params: { type: categoryForSerch, text: thingToSearch },
        });

        const data = response.data;
        console.log('respuesta del serch:', response);
        if (categoryForSerch == 'user') {
          setUserResult(data);
        } else if (categoryForSerch == 'question') {
          setQuestionResult(data);
        } else {
          setGroupResult(data);
        }
      } catch (error) {
        console.error('Error in serch:', error);
      }
    }
  }, [categoryForSerch, thingToSearch]);

  useEffect(() => {
    serch();
  }, [serch, thingToSearch]);

  console.log(groupResult, questionResult, userResult);

  return (
    <>
      <div className=" flex flex-col gap-5  items-center justify-center">
        <Input
          startContent={<LuSearch className="text-foreground-700" />}
          placeholder="Buscar en ScholarSync"
          value={thingToSearch}
          onValueChange={setThingToSearch}
        />
        <CustomTabs
          setTabs={setCategoryForSerch}
          selected={categoryForSerch}
        ></CustomTabs>
      </div>

      <h1>Serch Results</h1>
      <div></div>
    </>
  );
}
