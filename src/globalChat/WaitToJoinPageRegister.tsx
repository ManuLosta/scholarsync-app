import React, { useEffect, useState } from 'react';
import api from '../api';
import { emptyChat } from '../types/emptyChat';
import { Chat as ChaType } from '../types/types';
import { useStompClient } from 'react-stomp-hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@nextui-org/react';
import Chat from '../pages/Chat';

const WaitToJoinPageRegister: React.FC = () => {
  const { id } = useParams();
  const client = useStompClient();
  const [chat, setChat] = useState<ChaType>(emptyChat);
  const auth = useAuth();
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState<string>('request access');
  const [canAcces, SetCanAcces] = useState(false);
  if (auth.user === null || auth.user === undefined) {
    navigate('/global-chat/' + id);
  }
  console.log('chatId', id);
  api
    .get(`global-chat/get-chat?chatId=${id}`)
    .then((res) => {
      const data = res.data;
      if (data === 'chat/not-found') {
        setChat(emptyChat);
        return;
      } else setChat(data);
    })
    .catch((err) => {
      console.error(err);
      setChat(emptyChat);
    });

  function handleSave() {
    console.log('Register Join');
    client?.publish({
      destination: '/chat/request-access',
      body: JSON.stringify({ user_id: auth.user?.id, chat_id: chat.id }),
    });
  }

  useEffect(() => {
    function checkCanAccess() {
      // checks if the user can acces to the chat
      if (chat.members.some((member) => member.id === auth.user?.id)) {
        SetCanAcces(true);
      }
    }
    checkCanAccess();
  }, [chat, auth.user]);

  return (
    <>
      {canAcces ? (
        <Chat
          chatId={id?.toString() || ''}
          getChat={'global-chat/get-chat'}
        ></Chat>
      ) : (
        <>
          {chat !== emptyChat ? (
            <div>
              <h1>Welcome to {chat.name}</h1>
              <div></div>
              <Button
                onPress={() => {
                  handleSave();
                  setRequestStatus('request send');
                }}
              >
                {requestStatus}
              </Button>
            </div>
          ) : (
            <div>Chat not found</div>
          )}
        </>
      )}
    </>
  );
};

export default WaitToJoinPageRegister;
