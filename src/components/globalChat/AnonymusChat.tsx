import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import api from '../../api.ts';
import { Chat as ChatType } from '../../types/types';
import MemberList from '../groups/MemberList.tsx';
import { emptyChat } from '../../types/emptyChat.tsx';
import AnonymousChatBox from './AnonymusChatBox.tsx';
import { Button } from '@nextui-org/react';
import ShareChat from './ShareChat.tsx';

export default function AnonymousChat({
  name,
  chatId,
}: {
  name: string;
  chatId: string;
}) {
  const [chat, setChat] = useState<ChatType>(emptyChat);
  const navigate = useNavigate();

  useEffect(() => {
    function leaving() {
      api.post('global-chat/leave', { chatId: chatId, userId: name });
    }
    // This function is called when the component mounts
    return () => {
      leaving();
    };
  }, [chatId, name]);

  const fetchChat = useCallback(() => {
    api
      .get(`global-chat/get-chat?chatId=${chatId}`)
      .then((res) => {
        const data = res.data;
        console.log(data)
        setChat(data);
      })
      .catch((err) => console.error(err));
  }, [chatId]);
  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  return (
    chat && (
      <div className="container p-8 flex h-screen w-screen flex-col gap-2 mx-auto">
        <div className="flex justify-between items-center flex-none">
          <div>
            <h1 className="font-bold text-2xl">{chat?.name}</h1>
            <MemberList users={chat.members} />
          </div>
          <div className='flex gap-2'>
          <ShareChat chatId={chatId}  chatName={chat.name} />
          <Button
            onPress={() => {
              navigate('/login');
            }}
            color="danger"
          >
            Abandonar
          </Button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-2">
          <AnonymousChatBox
            anonymousName={name}
            chatId={chatId}
            onUserJoin={fetchChat}
          />
        </div>
      </div>
    )
  );
}
