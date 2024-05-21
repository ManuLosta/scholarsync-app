import { createContext, useEffect, useState } from 'react';
import { Group } from '../types/types';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

interface groupContextType {
  groups: Group[];
  fetchGroupsforProfile: CallableFunction;
}

const defaultContext = {
  groups: [],
  fetchGroupsforProfile: () => {},
};

export const groupContext = createContext<groupContextType>(defaultContext);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  const fetchGroupsforProfile = () => {
    api
      .get(`groups/getGroups?user_id=${user?.id}`)
      .then((res) => {
        const data = res.data;
        setGroups(data);
      })

      .catch((err) => {
        console.error('Error fetching groups', err);
      });
  };

  useEffect(() => {
    fetchGroupsforProfile();
  }, [user]);

  return (
    <groupContext.Provider value={{ groups, fetchGroupsforProfile }}>
      {children}
    </groupContext.Provider>
  );
};
