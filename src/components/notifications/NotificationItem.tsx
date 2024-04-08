import { LuUserPlus } from 'react-icons/lu';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button } from '@nextui-org/react';
import 'dayjs/locale/es-us.js';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

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
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const date: Date = new Date(created_at);

  dayjs.extend(relativeTime);
  dayjs.locale('es-us');
  const createdAt = dayjs(date).fromNow();

  const handleChange = (action: (id: string) => void) => {
    setIsVisible(false);
    setTimeout(() => {
      action(id);
    }, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          className="flex flex-col gap-4 items-center border-b p-3">
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
            <Button onPress={() => handleChange(notifications.rejectFriendRequest)}>Rechazar</Button>
            <Button
              color="primary"
              onPress={() => handleChange(notifications.acceptFriendRequest)}
            >
              Aceptar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
