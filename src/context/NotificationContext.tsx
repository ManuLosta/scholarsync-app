import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import api from '../api.ts';

interface NotificationContext {
  notifications: Notification[];
  acceptFriendRequest: (id: string) => void;
  rejectFriendRequest: (id: string) => void;
}

type Notification = {
  from: string;
  to: string;
  id: string;
  created_at: string;
};

const defaultContext = {
  notifications: [],
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
};

export const NotificationContext =
  createContext<NotificationContext>(defaultContext);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    api
      .get(`friend-requests/${user?.id}/friend-requests`)
      .then((res) => {
        const data = res.data;
        setNotifications(data);
      })
      .catch((err) => console.error('Error fetching notifications: ', err));
  }, [user?.id]);

  const acceptFriendRequest = (id: string) => {
    api
      .post('friend-requests/accept-request', { id })
      .then(() => {
        removeNotification(id);
      })
      .catch((err) => {
        console.error('Error accepting request: ', err);
      });
  };

  const rejectFriendRequest = (id: string) => {
    api
      .post('friend-requests/deny-request', { id })
      .then(() => {
        removeNotification(id);
      })
      .catch((err) => {
        console.error('Error rejecting request: ', err);
      });
  };

  const removeNotification = (id: string) => {
    const filteredNotifications = notifications.filter(
      (notification) => notification.id != id,
    );
    console.log(filteredNotifications);
    setNotifications(filteredNotifications);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, acceptFriendRequest, rejectFriendRequest }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
