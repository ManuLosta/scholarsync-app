import { createContext, useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

type Group = {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  createdBy: string;
  hasPicture: boolean;
};

interface groupContextType {
  groups: Group[];
  fetchGroupsforProfile: CallableFunction;
  loading: boolean;
}

const defaultContext = {
  groups: [],
  fetchGroupsforProfile: () => {},
  loading: true,
};

export const groupContext = createContext<groupContextType>(defaultContext);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupsforProfile = () => {
    setLoading(true);
    api
      .get(`groups/getGroups?user_id=${user?.id}`)
      .then((res) => {
        const data = res.data;
        setGroups(data);
      })
      .catch((err) => {
        console.error('Error fetching groups', err);
      });
    setLoading(false);
  };

  useEffect(() => {
    fetchGroupsforProfile();
  }, [user]);

  return (
    <groupContext.Provider value={{ groups, fetchGroupsforProfile, loading }}>
      {children}
    </groupContext.Provider>
  );
};
