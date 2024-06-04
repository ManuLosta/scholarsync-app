import { useEffect, useRef, useState } from 'react';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { Message } from '../../types/types';
import MessageBubble from './MessageBubble.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { Button, Input } from '@nextui-org/react';
import { LuSend } from 'react-icons/lu';
import api from '../../api.ts';

type ImageTable = {
  user: string;
  image: string;
};

export default function ChatBox({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('' as string);
  const [images, setImages] = useState<ImageTable[]>([]);
  const { user } = useAuth();
  const client = useStompClient();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([]);
  }, [chatId]);

  useSubscription(`/chat/${chatId}`, (message) => {
    const newMessage: Message = JSON.parse(message.body);
    setMessages([...messages, newMessage]);
    if (
      newMessage.sender.hasPicture &&
      !images.some((image) => image.user === newMessage.sender.id)
    ) {
      fetchImage(newMessage.sender.id);
    }
  });

  const fetchImage = (userId: string) => {
    api
      .get(`/users/get-profile-picture?user_id=${userId}`)
      .then((res) => {
        const data = res.data;
        const base64 = data.base64Encoding;
        const fileType = data.file.fileType;
        const imageSrc = `data:${fileType};base64,${base64}`;
        setImages((prevImages) => [
          ...prevImages,
          { user: userId, image: imageSrc },
        ]);
      })
      .catch((err) => console.error('Error fetching image: ', err));
  };

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
      <div className="flex flex-col gap-4 overflow-y-auto flex-grow overflow-x-hidden pe-10 mt-4">
        {messages.map((message) => (
          <div
            key={`${message.sender.id}${message.time}`}
            className={`flex ${message.sender.id === user?.id ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end`}
          >
            <MessageBubble
              image={
                images.find((image) => image.user === message.sender.id)?.image
              }
              message={message}
              isUser={message.sender.id === user?.id}
            />
          </div>
        ))}
        <div ref={lastMessageRef}></div>
      </div>
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
