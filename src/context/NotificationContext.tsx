import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import api from '../api.ts';
import { FriendRequest, GroupInvite } from '../types/types';

interface NotificationContext {
  notifications: (FriendRequest | GroupInvite)[];
  acceptFriendRequest: (id: string) => void;
  rejectFriendRequest: (id: string) => void;
  acceptGroupInvite: (id: string) => void;
  rejectGroupInvite: (id: string) => void;
}

const defaultContext = {
  notifications: [],
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
  acceptGroupInvite: () => {},
  rejectGroupInvite: () => {},
};

export const NotificationContext =
  createContext<NotificationContext>(defaultContext);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<
    (GroupInvite | FriendRequest)[]
  >([]);

  useEffect(() => {
    api
      .get(`notification/get-notifications/${user?.id}`)
      .then((res) => {
        const data = res.data;
        console.log(data);
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

  const acceptGroupInvite = (id: string) => {
    api
      .post('group-invitations/accept-invitation', {
        group_invitation_id: id,
      })
      .then(() => {
        removeNotification(id);
      })
      .catch((err) => {
        console.error('Error accepting invitation: ', err);
      });
  };

  const rejectGroupInvite = (id: string) => {
    api
      .post('group-invitations/reject-invitation', {
        group_invitation_id: id,
      })
      .then(() => {
        removeNotification(id);
      })
      .catch((err) => {
        console.error('Error accepting invitation: ', err);
      });
  };

  const removeNotification = (id: string) => {
    const filteredNotifications = notifications.filter(
      (notification) => notification.notification_id != id,
    );
    console.log(filteredNotifications);
    setNotifications(filteredNotifications);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        acceptFriendRequest,
        rejectFriendRequest,
        acceptGroupInvite,
        rejectGroupInvite,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
