import { useContext } from 'react';
import { groupContext } from '../context/GroupContext';

export const useGroups = () => {
  return useContext(groupContext);
};
