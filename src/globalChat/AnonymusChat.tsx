import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import api from '../api.ts';

import { Chat as ChatType } from '../types/types';
import MemberList from '../components/groups/MemberList.tsx';
import CanEnterToChatModal from '../globalChat/CanEnterToChatModal.tsx';
import { emptyChat } from '../types/emptyChat.tsx';
import AnonymousChatBox from './AnonymusChatBox.tsx';

export default function AnonymousChat({
  name,
  chatId,
}: {
  name: string;
  chatId: string;
}) {
  const [chat, setChat] = useState<ChatType>(emptyChat);
  const navigate = useNavigate();
  console.log('chatid', chatId);

  function leaving() {
    api.post('global-chat/leave', { chatId: chatId, userId: name });
  }
  useEffect(() => {
    // This function is called when the component mounts
    return () => {
      leaving();
    };
  }, []);

  const fetchChat = useCallback(() => {
    api
      .get(`global-chat/get-chat?chatId=${chatId}`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        setChat(data);
      })
      .catch((err) => console.error(err));
  }, [chatId]);
  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  return (
    chat && (
      <div className="container p-8 flex h-[93vh] flex-col gap-2">
        <CanEnterToChatModal chatId={chat.id}></CanEnterToChatModal>
        <div className="flex justify-between items-center flex-none">
          <div>
            <h1 className="font-bold text-2xl">{chat?.name}</h1>
            <MemberList users={chat.members} />
          </div>
          <Button
            onPress={() => {
              navigate('/login');
              leaving();
            }}
            color="danger"
          >
            Abandonar
          </Button>
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
