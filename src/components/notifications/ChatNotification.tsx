import { ChatNotification as NotificationType } from '../../types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { LuMessageCircle } from 'react-icons/lu';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications.ts';

export default function ChatNotification({
  notification,
}: {
  notification: NotificationType;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const { removeNotification } = useNotifications();
  const navigate = useNavigate();

  const handlePress = () => {
    setIsVisible(false);
    removeNotification(notification.notification_id);
    navigate(`/chat/${notification.chat_id}`);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          className="flex flex-col gap-4 items-center border-b p-3 w-full"
        >
          <div className="flex gap-4 justify-start w-full">
            <div className="rounded-full bg-primary p-2 text-white">
              <LuMessageCircle size={32} />
            </div>
            <div>
              <p>
                Se ha iniciado una sesión nueva {notification.name} en el grupo{' '}
                {notification.group}
              </p>
            </div>
          </div>
          <Button className="ms-auto" color="primary" onPress={handlePress}>
            Unirse
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
