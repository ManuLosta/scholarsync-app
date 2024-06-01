import { useEffect, useRef, useState } from 'react';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { Message } from '../../types/types';
import MessageBubble from './MessageBubble.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { Button, Input, ScrollShadow } from '@nextui-org/react';
import { LuSend } from 'react-icons/lu';

export default function ChatBox({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('' as string);
  const { user } = useAuth();
  const client = useStompClient();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([]);
  }, [chatId]);

  useSubscription(`/chat/${chatId}`, (message) => {
    const newMessage: Message = JSON.parse(message.body);
    setMessages([...messages, newMessage]);
  });

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message != '') {
      client?.publish({
        destination: '/app/chat/send-message',
        body: JSON.stringify({ message, sender_id: user?.id, chat_id: chatId }),
      });
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <ScrollShadow
        hideScrollBar
        className="flex flex-col gap-4 pt-4 overflow-y-auto flex-grow"
      >
        {messages.map((message) => (
          <div
            key={`${message.sender.id}${message.time}`}
            className={`flex ${message.sender.id === user?.id ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end`}
          >
            <MessageBubble
              message={message}
              isUser={message.sender.id === user?.id}
            />
          </div>
        ))}
        <div ref={lastMessageRef}></div>
      </ScrollShadow>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input value={message} onChange={handleChange} autoComplete="off" />
        <Button
          type="submit"
          className="rounded-full focus:outline-none"
          color="primary"
          isIconOnly
        >
          <LuSend />
        </Button>
      </form>
    </div>
  );
}
