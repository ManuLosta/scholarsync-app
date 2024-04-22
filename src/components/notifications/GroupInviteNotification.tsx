import { GroupInvite } from '../../types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { LuUsers } from 'react-icons/lu';
import { Button } from '@nextui-org/react';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { useState } from 'react';

export default function GroupInviteNotification({
  groupInvite,
}: {
  groupInvite: GroupInvite;
}) {
  const notifications = useNotifications();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { id, name } = groupInvite;

  const handleChange = (action: (id: string) => void) => {
    setIsVisible(false);
    setTimeout(() => {
      action(id);
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
              <p>Te han invitado al grupo {name}</p>
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
