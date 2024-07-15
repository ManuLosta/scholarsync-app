import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  useDisclosure,
} from '@nextui-org/react';
import api from '../../api.ts';

import { Chat as ChatType } from '../../types/types';
import MemberList from '../groups/MemberList.tsx';
import { emptyChat } from '../../types/emptyChat.tsx';
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

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
      <div className="container p-8 flex h-[93vh] flex-col gap-2 mx-auto">
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

        <div className="flex justify-between items-center flex-none">
          <div>
            <h1 className="font-bold text-2xl">{chat?.name}</h1>
            <MemberList users={chat.members} />
          </div>
          <Button
            onPress={() => {
              navigate('/login');
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
