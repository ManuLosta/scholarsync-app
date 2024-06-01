import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStompClient } from 'react-stomp-hooks';
import { useAuth } from '../hooks/useAuth.ts';
import { Button } from '@nextui-org/react';
import api from '../api.ts';
import ChatBox from '../components/chat/ChatBox.tsx';

type Chat = {
  id: string;
  name: string;
};

export default function Chat() {
  const [chat, setChat] = useState<Chat | null>(null); // [1
  const { id } = useParams();
  const { user } = useAuth();
  const client = useStompClient();

  useEffect(() => {
    client?.publish({
      destination: '/app/chat/join',
      body: JSON.stringify({ chat_id: id, user_id: user?.id }),
    });

    return () => {
      client?.publish({
        destination: '/app/chat/leave',
        body: JSON.stringify({ chat_id: id, user_id: user?.id }),
      });
    };
  }, [client, id, user?.id]);

  useEffect(() => {
    api
      .get(`chat/get-chat?chatId=${id}`)
      .then((res) => {
        const data = res.data;
        setChat(data);
      })
      .then((err) => console.error(err));
  }, [id]);

  return (
    chat && (
      <div className="container p-8 flex h-[92vh] flex-col gap-2">
        <div className="flex justify-between items-center flex-none">
          <h1 className="font-bold text-2xl">{chat?.name}</h1>
          <Button
            onPress={() =>
              client?.publish({
                destination: '/app/chat/leave',
                body: JSON.stringify({ chat_id: id, user_id: user?.id }),
              })
            }
            color="danger"
          >
            Leave
          </Button>
        </div>
        <div className="flex-grow overflow-hidden">
          <ChatBox chatId={chat?.id || ''} />
        </div>
      </div>
    )
  );
}
