import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import api from '../api.ts';
import { ChatNotification, FriendRequest, GroupInvite } from '../types/types';
import { useSubscription } from 'react-stomp-hooks';
import { v4 as uuidv4 } from 'uuid';
import { useGroups } from '../hooks/useGroups.ts';

interface NotificationContext {
  notifications: (FriendRequest | GroupInvite | ChatNotification)[];
  acceptFriendRequest: (id: string) => void;
  rejectFriendRequest: (id: string) => void;
  acceptGroupInvite: (id: string) => void;
  rejectGroupInvite: (id: string) => void;
  removeNotification: (id: string) => void;
}

const defaultContext = {
  notifications: [],
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
  acceptGroupInvite: () => {},
  rejectGroupInvite: () => {},
  removeNotification: () => {},
};

export const NotificationContext =
  createContext<NotificationContext>(defaultContext);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, sessionId } = useAuth();
  const [notifications, setNotifications] = useState<
    (GroupInvite | FriendRequest | ChatNotification)[]
  >([]);
  const { fetchGroupsforProfile } = useGroups();

  useSubscription(`/individual/${sessionId}/notification`, (message) => {
    const notification = JSON.parse(message.body);
    setNotifications([...notifications, notification]);
  });

  useSubscription(`/individual/${sessionId}/chat`, (message) => {
    const notification = {
      ...JSON.parse(message.body),
      notification_id: uuidv4(),
      notificationType: 'NEW_CHAT',
    };
    setNotifications([...notifications, notification]);
  });

  useEffect(() => {
    api
      .get(`notification/get-notifications/${user?.id}`)
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

  const acceptGroupInvite = (id: string) => {
    api
      .post('group-invitations/accept-invitation', {
        group_invitation_id: id,
      })
      .then(() => {
        removeNotification(id);
        fetchGroupsforProfile();
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
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
