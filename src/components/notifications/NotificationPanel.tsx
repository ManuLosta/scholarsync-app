import FriendRequestNotification from './FriendRequestNotification.tsx';
import { Button } from '@nextui-org/react';
import { LuArrowRightFromLine } from 'react-icons/lu';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { FriendRequest, GroupInvite } from '../../types/types';
import GroupInviteNotification from './GroupInviteNotification.tsx';
import { ChatNotification as ChatType } from '../../types/types';
import ChatNotification from './ChatNotification.tsx';

export default function NotificationPanel({
  isOpen,
  handleOpen,
}: {
  isOpen: boolean;
  handleOpen: () => void;
}) {
  const { notifications } = useNotifications();

  return (
    <aside
      className={`${!isOpen && 'translate-x-full opacity-70'}
      transition opacity-100 w-[512px] duration-300 right-0 border-l border-foreground-200 rounded-l-xl drop-shadow-2xl fixed flex flex-row h-screen bg-background p-4 z-50`}
    >
      <section className="flex flex-col w-full">
        <div className="flex align-center gap-3">
          <Button
            variant="ghost"
            isIconOnly
            onPress={handleOpen}
            className="border-none text-foreground-600"
          >
            <LuArrowRightFromLine size={25} />
          </Button>
          <h2 className="mt-1 text-2xl font-semibold">Notificaciones</h2>
        </div>
        <div className="flex gap-0 flex-col items-center overflow-y-auto overflow-x-hidden p-3 h-full justify-start">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const type = notification.notificationType;
              if (type == 'FRIEND_REQUEST')
                return (
                  <FriendRequestNotification
                    handleOpen={handleOpen}
                    key={notification.notification_id}
                    friendRequest={notification as FriendRequest}
                  />
                );
              else if (type == 'GROUP_INVITE')
                return (
                  <GroupInviteNotification
                    handleOpen={handleOpen}
                    key={notification.notification_id}
                    groupInvite={notification as GroupInvite}
                  />
                );
              else if (type == 'NEW_CHAT')
                return (
                  <ChatNotification
                    notification={notification as ChatType}
                    key={notification.notification_id}
                  />
                );
            })
          ) : (
            <div className="flex items-center justify-center mt-10 w-full">
              <p>No hay notificaciones</p>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}
