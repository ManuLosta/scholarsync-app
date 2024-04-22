import { GroupInvite } from '../../types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { LuUsers } from 'react-icons/lu';
import { Button } from '@nextui-org/react';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GroupInviteNotification({
  groupInvite,
  handleOpen
}: {
  groupInvite: GroupInvite;
  handleOpen: () => void;
}) {
  const notifications = useNotifications();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { notification_id, title, group_id } = groupInvite;

  const handleChange = (action: (id: string) => void) => {
    setIsVisible(false);
    setTimeout(() => {
      action(notification_id);
    }, 300);
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
              <LuUsers size={32} />
            </div>
            <div>
              <p>Te han invitado al grupo{' '}
                <Link onClick={handleOpen} className="font-bold hover:text-primary" to={`/group/${group_id}`}>{title}</Link>
              </p>
            </div>
          </div>
          <div className="w-full flex gap-3 justify-end">
            <Button
              onPress={() => handleChange(notifications.rejectGroupInvite)}
            >
              Rechazar
            </Button>
            <Button
              color="primary"
              onPress={() => handleChange(notifications.acceptGroupInvite)}
            >
              Aceptar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
