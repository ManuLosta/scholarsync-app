import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext.tsx';

export const useNotifications = () => {
  return useContext(NotificationContext);
};
