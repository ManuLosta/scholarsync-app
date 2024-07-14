import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useStompClient } from 'react-stomp-hooks';
import { useAuth } from '../hooks/useAuth.ts';
import api from '../api.ts';
import ChatBox from '../components/chat/ChatBox.tsx';
import { Chat as ChatType } from '../types/types';
import MemberList from '../components/groups/MemberList.tsx';
import CanEnterToChatModal from '../globalChat/CanEnterToChatModal.tsx';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Snippet,
  useDisclosure,
} from '@nextui-org/react';

export default function Chat({
  getChat = 'chat/get-chat',
  chatId = '',
}: {
  getChat?: string;
  chatId?: string;
}) {
  const [chat, setChat] = useState<ChatType | null>(null);
  const { id } = useParams();
  const { user } = useAuth();
  const client = useStompClient();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  useEffect(() => {
    client?.publish({
      destination: '/app/chat/join',
      body: JSON.stringify({ chat_id: id || chatId, user_id: user?.id }),
    });

    return () => {
      const isLeaving = true;

      if (isLeaving) {
        client?.publish({
          destination: '/app/chat/leave',
          body: JSON.stringify({ chat_id: id || chatId, user_id: user?.id }),
        });
      }
    };
  }, [id, user?.id, client, chatId]);

  const fetchChat = useCallback(() => {
    api
      .get(`${getChat}?chatId=${id || chatId}`)
      .then((res) => {
        const data = res.data;
        console.log('El chat en Chat:', data);
        setChat(data);
      })
      .catch((err) => console.error(err));
  }, [chatId, getChat, id]);
  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  return (
    chat && (
      <div className="container p-8 flex h-[93vh] flex-col gap-2">
        <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Comparti la sesion!
                </ModalHeader>
                <ModalBody>
                  <Snippet color="primary">{`http://localhost:5173/global-chat-external/${chatId}`}</Snippet>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <CanEnterToChatModal chatId={chat.id}></CanEnterToChatModal>
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
