import { Message } from '../../types/types';
import { Avatar } from '@nextui-org/react';
import UserTooltip from '../user/UserTooltip.tsx';

export default function MessageBubble({ message }: { message: Message }) {
  return (
    <>
      <Avatar />
      <div>
        <UserTooltip user={message.sender}>
          <p className="font-light">@{message.sender.username}</p>
        </UserTooltip>
        <div></div>
        <div className="bg-primary rounded-2xl py-2 px-3">
          <p className="text-white">{message.message}</p>
        </div>
      </div>
    </>
  );
}
