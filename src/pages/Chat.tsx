import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useStompClient } from 'react-stomp-hooks';
import { useAuth } from '../hooks/useAuth.ts';
import { Button } from '@nextui-org/react';
import api from '../api.ts';

type Chat = {
  name: string;
};

export default function Chat() {
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
    api.get(`chat/get-chat?chatId=${id}`).then((res) => console.log(res));

    client?.subscribe(`/chat/${id}`, (message) => {
      console.log(JSON.parse(message.body));
    });
  }, []);

  return (
    <div>
      This is chat
      <Button
        onPress={() =>
          client?.publish({
            destination: '/app/chat/send-message',
            body: JSON.stringify({
              chat_id: id,
              sender_id: user?.id,
              message: 'Hello',
            }),
          })
        }
      >
        Send message
      </Button>
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
  );
}
