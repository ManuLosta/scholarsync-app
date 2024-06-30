import { useEffect, useState } from 'react';
import { Chat as ChatType } from '../../types/types';
import api from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import MemberList from '../groups/MemberList';
import { Button } from '@nextui-org/react';

export default function Chat() {
  const [chat, setChat] = useState<ChatType | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchChat();
  }, [chat, id]);

  return (
    chat && (
      <div className="container p-8 flex h-[93vh] flex-col gap-2">
        <div className="flex justify-between items-center flex-none">
          <div>
            <h1 className="font-bold text-2xl">{chat?.name}</h1>
            <MemberList users={chat.members} />
          </div>
          <Button onPress={() => navigate('/login')} color="danger">
            Salir
          </Button>
        </div>
        <div className="flex-grow overflow-auto p-2"></div>
      </div>
    )
  );
}
