import React, { useEffect, useState } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Modal,
} from '@nextui-org/react';
import api from '../api';
import { emptyChat } from '../types/emptyChat';
import { Chat } from '../types/types';
import { useStompClient } from 'react-stomp-hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AnonymusChat from './AnonymusChat';

const WaitToJoinPageAnonymous: React.FC = () => {
  const [requestStatus, setRequestStatus] = useState<string>('request access');
  const { id } = useParams();
  const client = useStompClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setNameInput] = useState('');
  const [chat, setChat] = useState<Chat>(emptyChat);
  const auth = useAuth();
  const navigate = useNavigate();
  const [canAcces, SetCanAcces] = useState(false);

  if (auth.user !== null || auth.user !== undefined) {
    navigate('/global-chat/' + id);
  }

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

  function handleSave(onClose: () => void) {
    console.log('Anonimus join');
    client?.publish({
      destination: '/chat/request-anonymous-access',
      body: JSON.stringify({ username: name, chat_id: chat.id }),
    });
    onClose();
    setRequestStatus('request send');
  }

  useEffect(() => {
    function checkCanAccess() {
      SetCanAcces(false);
    }

    checkCanAccess();
  }, []);

  return (
    <>
      {canAcces ? (
        <AnonymusChat />
      ) : (
        <>
          {chat !== emptyChat && (
            <div>
              <h1>Welcome to {chat.name}</h1>
              <div></div>
              <Button
                onPress={() => {
                  onOpen();
                }}
              >
                {requestStatus}
              </Button>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Enter Your Name
                      </ModalHeader>
                      <ModalBody>
                        <Input
                          autoFocus
                          label="Name"
                          placeholder="Enter your name"
                          variant="bordered"
                          value={name}
                          onValueChange={setNameInput}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                          Cancelar
                        </Button>
                        <Button
                          color="primary"
                          onPress={() => handleSave(onClose)}
                        >
                          Solicitar unirse
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          )}
          {!chat && <div>Chat not found</div>}
        </>
      )}
    </>
  );
};

export default WaitToJoinPageAnonymous;
