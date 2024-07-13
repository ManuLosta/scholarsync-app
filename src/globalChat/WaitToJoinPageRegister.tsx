import React, { useEffect, useState } from 'react';
import api from '../api';
import { emptyChat } from '../types/emptyChat';
import { Chat as ChaType } from '../types/types';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
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
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    if (auth.user?.id === null || auth.user?.id === undefined) {
      navigate('/global-chat-external/' + id);
    }
  }, [auth.user, id, navigate]);

  useEffect(() => {
    api
      .get(`global-chat/get-chat?chatId=${id}`)
      .then((res) => {
        const data = res.data;
        if (data === 'chat/not-found') {
          setChat(emptyChat);
        } else {
          setChat(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setChat(emptyChat);
      });
  }, [id]);

  useEffect(() => {
    if (chat.members.some((member) => member.id === auth.user?.id)) {
      setCanAccess(true);
    }
  }, [chat, auth.user]);

  function handleSave() {
    console.log('Register Join');
    client?.publish({
      destination: '/app/chat/request-access',
      body: JSON.stringify({ user_id: auth.user?.id, chat_id: chat.id }),
    });
  }

  useSubscription(
    `/individual/${auth.user?.id}/chat-request-accepted`,
    (message) => {
      setCanAccess(true);
      console.log(message);
    },
  );

  return (
    <>
      {canAccess ? (
        <Chat chatId={id?.toString() || ''} getChat={'global-chat/get-chat'} />
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
