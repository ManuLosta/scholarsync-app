import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';

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
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/friend-requests/${user?.id}/friend-requests`,
        );

        if (res.ok) {
          const data = await res.json();
          const newNotifications: Array<Notification> = data.map(
            (notification: Notification) => ({
              from: notification.from,
              to: notification.to,
              id: notification.id,
              created_at: notification.created_at,
            }),
          );
          setNotifications(newNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const acceptFriendRequest = async (id: string) => {
    const res = await fetch(
      `http://localhost:8080/api/v1/friend-requests/accept-request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      },
    );

    const text = await res.text();
    removeNotification(id);
    return text;
  };

  const rejectFriendRequest = async (id: string) => {
    const res = await fetch(`http://localhost:8080/api/v1/friend-requests/deny-request`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id})
    })

    const text = await res.text();
    removeNotification(id);
    return text;
  }

  const removeNotification = (id: string) => {
    const filteredNotifications = notifications.filter(
      (notification) => notification.id != id,
    );
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
