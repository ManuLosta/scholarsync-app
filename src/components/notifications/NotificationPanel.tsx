import FriendRequestNotification from './FriendRequestNotification.tsx';
import { Button } from '@nextui-org/react';
import { LuArrowRightFromLine } from 'react-icons/lu';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { FriendRequest, GroupInvite } from '../../types/types';
import GroupInviteNotification from './GroupInviteNotification.tsx';

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
      transition opacity-100 w-[512px] duration-300 right-0 border-l border-foreground-200 rounded-l-xl fixed flex flex-row h-screen drop-shadow-2xl bg-background p-4 mt-[64px]`}
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
        <div className="flex mt-6 gap-0 flex-col items-start justify-center">
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
