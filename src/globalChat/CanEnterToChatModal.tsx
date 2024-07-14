import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { useAuth } from '../hooks/useAuth';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';

import CustomUser from './CustomUser';
import { useEffect, useState } from 'react';
import { Profile } from '../types/types';
import api from '../api';
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
  const [name, setName] = useState('');
  const [chatIdAndUserId, SetChatIdAndUserId] = useState<ChatIdAndUserId>();
  const [isId, setIsId] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  function getProfile() {
    api
      .get(`users/profile/` + chatIdAndUserId?.userId)
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    if (profile !== undefined) {
      onOpen();
    }
  }, [onOpen, profile]);

  useSubscription(`/individual/${user?.id}/chat-access-request`, (message) => {
    console.log('lo que llego', message.body);
    const newMessage: Message = JSON.parse(message.body);
    if (newMessage.username == undefined) {
      console.log('user coso');
      setIsId(true);
      SetChatIdAndUserId(newMessage);
      getProfile();
      console.log(profile);
    } else {
      setIsId(false);
      setProfile(undefined);
      setName(newMessage.username);
      onOpen();
    }
  });

  function handleAcces() {
    if (isId) {
      client?.publish({
        destination: '/app/chat/accept-access',
        body: JSON.stringify({
          user_id: chatIdAndUserId?.userId,
          chat_id: chatId,
        }),
      });
    } else {
      console.log('no id');
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
              {profile ? (
                <CustomUser
                  user={profile}
                  statusColor={'primary'}
                  isAnonymous={false}
                ></CustomUser>
              ) : (
                <CustomUser
                  user={{
                    hasPicture: false,
                    firstName: '',
                    lastName: '',
                    username: name,
                    credits: 0,
                    level: 'Newbie',
                    xp: 0,
                    prevLevel: 0,
                    nextLevel: 0,
                    email: '',
                    birthDate: '',
                    createdAt: '',
                    id: '',
                    questions: 0,
                    answers: 0,
                    friends: [],
                    groups: [],
                  }}
                  statusColor={'danger'}
                  isAnonymous={true}
                ></CustomUser>
              )}
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
