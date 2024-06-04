import { Message } from '../../types/types';
import { Avatar } from '@nextui-org/react';
import UserTooltip from '../user/UserTooltip.tsx';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

export default function MessageBubble({
  message,
  isUser,
  image,
}: {
  message: Message;
  isUser: boolean;
  image: string | undefined;
}) {
  return (
    <>
      {!isUser && <Avatar src={image} name={message.sender.firstName} />}
      <div className="max-w-[75%]">
        {!isUser && (
          <UserTooltip user={message.sender}>
            <p className="font-light">@{message.sender.username}</p>
          </UserTooltip>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`${isUser ? 'bg-foreground-300' : 'bg-primary'} rounded-2xl py-2 px-3`}
        >
          <p className={`${!isUser && 'text-white'}`}>{message.message}</p>
          <p
            className={`font-light text-xs ${isUser ? 'text-start' : 'text-end text-white'}`}
          >
            {dayjs(message.time).format('h:mm A')}
          </p>
        </motion.div>
      </div>
    </>
  );
}
