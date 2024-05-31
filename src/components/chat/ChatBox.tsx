import { useState } from 'react';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { Message } from '../../types/types';
import MessageBubble from './MessageBubble.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { Button, Input } from '@nextui-org/react';
import { LuSend } from 'react-icons/lu';

export default function ChatBox({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('' as string);
  const { user } = useAuth();
  const client = useStompClient();

  useSubscription(`/chat/${chatId}`, (message) => {
    const newMessage: Message = JSON.parse(message.body);
    setMessages([...messages, newMessage]);
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    client?.publish({
      destination: '/app/chat/send-message',
      body: JSON.stringify({ message, sender_id: user?.id, chat_id: chatId }),
    });
    setMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  return (
    <div className="grow ">
      <div className="flex flex-col gap-4 h-full pt-4">
        {messages.map((message) => {
          if (message.sender.id === user?.id) {
            return (
              <div className="flex flex-row-reverse gap-2 items-end">
                <MessageBubble message={message} />
              </div>
            );
          } else {
            return (
              <div className="flex flex-row gap-2 items-end">
                <MessageBubble message={message} />
              </div>
            );
          }
        })}
      </div>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input value={message} onChange={handleChange} />
        <Button
          type="submit"
          className="rounded-full"
          color="primary"
          isIconOnly
        >
          <LuSend />
        </Button>
      </form>
    </div>
  );
}
