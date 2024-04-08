import { LuUserPlus } from 'react-icons/lu';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button } from '@nextui-org/react';
import 'dayjs/locale/es-us.js';
import { useNotifications } from '../../hooks/useNotifications.ts';

export default function NotificationItem({
  id,
  from,
  created_at,
}: {
  id: string;
  from: string;
  created_at: string;
}) {
  const notifications = useNotifications();

  const date: Date = new Date(created_at);

  dayjs.extend(relativeTime);
  dayjs.locale('es-us');
  const createdAt = dayjs(date).fromNow();

  return (
    <div className="flex flex-col gap-4 items-center border-b p-3">
      <div className="flex gap-4">
        <div className="rounded-full bg-primary p-2 text-white">
          <LuUserPlus size={32} />
        </div>
        <div>
          <p>
            <span className="font-bold">@{from}</span> ha enviado una solicitud
            de amistad.
          </p>
          <p className="text-foreground-600">{createdAt}</p>
        </div>
      </div>
      <div className="w-full flex gap-3 justify-end">
        <Button onPress={() => notifications.rejectFriendRequest(id)}>Rechazar</Button>
        <Button
          color="primary"
          onPress={() => notifications.acceptFriendRequest(id)}
        >
          Aceptar
        </Button>
      </div>
    </div>
  );
}
