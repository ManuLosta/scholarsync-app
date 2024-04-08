import NotificationItem from './NotificationItem.tsx';
import { Button } from '@nextui-org/react';
import { LuArrowRightFromLine } from 'react-icons/lu';
import { useNotifications } from '../../hooks/useNotifications.ts';

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
      transition opacity-100 min-w-[512px] duration-1000 right-0 border-l border-foreground-200 rounded-l-xl fixed flex flex-row h-screen drop-shadow-2xl bg-background p-4`}
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
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              from={notification.from}
              created_at={notification.created_at}
            />
          ))}
        </div>
      </section>
    </aside>
  );
}
