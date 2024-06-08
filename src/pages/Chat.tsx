import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStompClient } from 'react-stomp-hooks';
import { useAuth } from '../hooks/useAuth.ts';
import { Button } from '@nextui-org/react';
import api from '../api.ts';
import ChatBox from '../components/chat/ChatBox.tsx';
import { Chat as ChatType } from '../types/types';
import MemberList from '../components/groups/MemberList.tsx';

export default function Chat() {
  const [chat, setChat] = useState<ChatType | null>(null); // [1
  const { id } = useParams();
  const { user } = useAuth();
  const client = useStompClient();
  const navigate = useNavigate();

  useEffect(() => {
    client?.publish({
      destination: '/app/chat/join',
      body: JSON.stringify({ chat_id: id, user_id: user?.id }),
    });

    return () => {
      const isLeaving = true;

      if (isLeaving) {
        client?.publish({
          destination: '/app/chat/leave',
          body: JSON.stringify({ chat_id: id, user_id: user?.id }),
        });
      }
    };
  }, [id, user?.id, client]);

  useEffect(() => {
    fetchChat();
  }, [id]);

  const fetchChat = () => {
    api
      .get(`chat/get-chat?chatId=${id}`)
      .then((res) => {
        const data = res.data;
        console.log(chat);
        setChat(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    chat && (
      <div className="container p-8 flex h-[93vh] flex-col gap-2">
        <div className="flex justify-between items-center flex-none">
          <div>
            <h1 className="font-bold text-2xl">{chat?.name}</h1>
            <MemberList users={chat.members} />
          </div>
          <Button onPress={() => navigate('/')} color="danger">
            Abandonar
          </Button>
        </div>
        <div className="flex-grow overflow-auto p-2">
          <ChatBox chatId={chat?.id || ''} onUserJoin={fetchChat} />
        </div>
      </div>
    )
  );
}
