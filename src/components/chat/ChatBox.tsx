import React, { useEffect, useRef, useState } from 'react';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { FileMessage, Message } from '../../types/types';
import MessageBubble from './MessageBubble.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { Button, Input, Tooltip } from '@nextui-org/react';
import { LuFile, LuSend } from 'react-icons/lu';
import api from '../../api.ts';

type ImageTable = {
  user: string;
  image: string;
};

interface SystemMessage {
  user_qty: number;
  username: string;
  has_joined: boolean;
  is_system: boolean;
}

export default function ChatBox({
  chatId,
  onUserJoin,
}: {
  chatId: string;
  onUserJoin: () => void;
}) {
  const [messages, setMessages] = useState<
    (Message | SystemMessage | FileMessage)[]
  >([]);
  const [message, setMessage] = useState('' as string);
  const [images, setImages] = useState<ImageTable[]>([]);
  const { user } = useAuth();
  const client = useStompClient();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMessages([]);
  }, [chatId]);

  useSubscription(`/chat/${chatId}`, (message) => {
    const newMessage: Message = JSON.parse(message.body);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    if (
      newMessage.sender.hasPicture &&
      !images.some((image) => image.user === newMessage.sender.id)
    ) {
      fetchImage(newMessage.sender.id);
    }
    onUserJoin();
  });

  useSubscription(`/chat/${chatId}/files`, (message) => {
    const file: FileMessage = JSON.parse(message.body);
    console.log('Received file: ', file);
    setMessages((prevMessages) => [...prevMessages, file]);
  });

  useSubscription(`/chat/${chatId}/info`, (message) => {
    console.log('info', message);
    const newMessage = JSON.parse(message.body);
    onUserJoin();
    console.log(newMessage);
    setMessages((prevMessages) => [
      ...prevMessages,
      { is_system: true, ...newMessage },
    ]);
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
    if (message !== '') {
      client?.publish({
        destination: '/app/chat/send-message',
        body: JSON.stringify({ message, sender_id: user?.id, chat_id: chatId }),
      });
      setMessage('');
    }

    if (inputRef.current) inputRef.current.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user?.id || '');
      formData.append('chatId', chatId);

      api
        .post('/chat/upload-file', formData)
        .then(() => {
          console.log('File uploaded');
        })
        .catch((err) => console.error('Error uploading file: ', err));
    }
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex flex-col gap-4 overflow-y-auto flex-grow pe-10 mt-4">
        {messages.map((message, index) => {
          if ('is_system' in message && message.is_system) {
            return (
              <div className="w-full text-center" key={index}>
                <p>
                  Se ha {message.has_joined ? 'unido' : 'ido'} el usuario @
                  {message.username}
                </p>
              </div>
            );
          } else {
            message = message as Message | FileMessage;
            return (
              <div
                key={index}
                className={`flex ${message.sender.id === user?.id ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end`}
              >
                <MessageBubble
                  image={
                    images.find(
                      (image) =>
                        image.user ===
                        (message as Message | FileMessage).sender.id,
                    )?.image
                  }
                  message={message}
                  isUser={message.sender.id === user?.id}
                />
              </div>
            );
          }
        })}
        <div ref={lastMessageRef}></div>
      </div>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          value={message}
          onChange={handleChange}
          autoComplete="off"
        />
        <Tooltip content="Enviar archivo" placement="top">
          <Button isIconOnly className="bg-background hover:bg-foreground-200">
            <LuFile />
            <input
              type="file"
              className="w-full h-full absolute opacity-0 hover:cursor-pointer"
              title=""
              onChange={handleFileChange}
            />
          </Button>
        </Tooltip>
        <Button
          type="submit"
          className="rounded-full outline-none"
          color="primary"
          isIconOnly
        >
          <LuSend />
        </Button>
      </form>
    </div>
  );
}
