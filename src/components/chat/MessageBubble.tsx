import { FileMessage, Message } from '../../types/types';
import { Avatar } from '@nextui-org/react';
import UserTooltip from '../user/UserTooltip.tsx';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import FileDownloader from '../question/FileDownloader.tsx';
import ChatImage from './ChatImage.tsx';

export default function MessageBubble({
  message,
  isUser,
  image,
}: {
  message: Message | FileMessage;
  isUser: boolean;
  image: string | undefined;
}) {
  const getMessageContent = (message: Message | FileMessage) => {
    if ('message' in message) {
      return <p className={`${!isUser && 'text-white'}`}>{message.message}</p>;
    } else if (message.file.file_type.includes('image')) {
      return <ChatImage image={message.file} />;
    } else {
      return <FileDownloader files={[message.file]} />;
    }
  };

  const getBackgroundClass = (message: Message | FileMessage) => {
    if ('file' in message) {
      return '';
    } else {
      return isUser ? 'bg-foreground-300' : 'bg-primary';
    }
  };

  const getAvatarMargin = (message: Message | FileMessage) => {
    if ('file' in message) {
      return 'mb-[2em]';
    } else {
      return 'mb-0';
    }
  };

  const getTimeColor = (message: Message | FileMessage) => {
    if ('file' in message) {
      return 'text-foreground';
    } else {
      return isUser ? 'text-foreground' : 'text-background';
    }
  };

  return (
    <>
      {!isUser && (
        <Avatar
          className={getAvatarMargin(message)}
          src={image}
          name={message.sender.firstName}
        />
      )}
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
          className={`${getBackgroundClass(message)} rounded-2xl py-2 px-3`}
        >
          {getMessageContent(message)}
          <p className={`font-light text-xs ${getTimeColor(message)}`}>
            {dayjs(message.time).format('h:mm A')}
          </p>
        </motion.div>
      </div>
    </>
  );
}
