import { createContext, useEffect, useState } from 'react';
import { Group } from '../types/types';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

interface groupContextType {
  groups: Group[];
}

const defaultContext = {
  groups: [],
};

export const groupContext = createContext<groupContextType>(defaultContext);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  const fetchGroups = (userId: string | undefined) => {
    api
      .get(`groups/getGroups?user_id=${userId}`)
      .then((res) => {
        const data = res.data;
        setGroups(data);
      })

      .catch((err) => {
        console.error('Error fetching groups', err);
      });
  };

  useEffect(() => {
    fetchGroups(user?.id);
  }, [user]);

  return (
    <groupContext.Provider value={{ groups }}>{children}</groupContext.Provider>
  );
};
