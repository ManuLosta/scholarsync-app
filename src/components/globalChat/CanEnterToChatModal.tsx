import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { useAuth } from '../../hooks/useAuth';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';

import { useState } from 'react';
import CustomUser2 from './CustomUser2';

type Message = {
  chatId: string;
  username: string;
  userId: string;
};

type ChatIdAndUserId = {
  chatId: string;
  userId: string;
};

export default function CanEnterToChatModal({ chatId }: { chatId: string }) {
  const client = useStompClient();
  const { user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState<string | undefined>();
  const [chatIdAndUserId, SetChatIdAndUserId] = useState<ChatIdAndUserId>();

  useSubscription(`/individual/${user?.id}/chat-access-request`, (message) => {
    console.log('lo que llego', message.body);
    const newMessage: Message = JSON.parse(message.body);
    if (newMessage.username == undefined) {
      SetChatIdAndUserId(newMessage);
      setName(undefined);
      onOpen();
    } else {
      SetChatIdAndUserId(undefined);
      setName(newMessage.username);
      onOpen();
    }
  });

  function handleAcces() {
    if (chatIdAndUserId) {
      client?.publish({
        destination: '/app/chat/accept-access',
        body: JSON.stringify({
          user_id: chatIdAndUserId?.userId,
          chat_id: chatId,
        }),
      });
    } else {
      client?.publish({
        destination: '/app/chat/accept-anonymous-access',
        body: JSON.stringify({ username: name, chat_id: chatId }),
      });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Un nuevo usuario quiere entrar
            </ModalHeader>
            <ModalBody>
              <CustomUser2
                chatIdAndUserId={chatIdAndUserId}
                statusColor={'danger'}
                name={name || ''}
              ></CustomUser2>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Ignorar
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                onClick={() => handleAcces()}
              >
                Permitir
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
