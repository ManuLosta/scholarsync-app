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
import api from '../../api';
import { emptyChat } from '../../types/emptyChat';
import { Chat } from '../../types/types';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AnonymusChat from './AnonymusChat';

const WaitToJoinPageAnonymous: React.FC = () => {
  const [requestStatus, setRequestStatus] = useState<string>('request access');
  const { id } = useParams();
  const client = useStompClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setNameInput] = useState('');
  const [questionName, setQuestionName] = useState('Elije un nombre');
  const [chat, setChat] = useState<Chat>(emptyChat);
  const auth = useAuth();
  const navigate = useNavigate();
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    if (auth.user?.id !== undefined) {
      navigate('/global-chat/' + id);
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
    setCanAccess(false);
  }, [chat, auth.user]);

  function handleSave(onClose: () => void) {
    console.log('Anonimus join');
    client?.publish({
      destination: '/app/chat/request-anonymous-access',
      body: JSON.stringify({ chat_id: chat.id, username: name }),
    });
    onClose();
    setRequestStatus('request send');
  }

  function userNameTaken() {
    setRequestStatus('request access');
    setQuestionName('Elije otro Nombre, ese ya esta en uso');
    onOpen();
  }

  useSubscription(`/individual/${name}/error`, (message) => {
    userNameTaken();
    console.log(message);
  });

  useSubscription(`/individual/${name}/chat-request-accepted`, (message) => {
    setCanAccess(true);
    console.log('se acepto', message);
  });

  return (
    <>
      {canAccess ? (
        <AnonymusChat name={name} chatId={id || ''} />
      ) : (
        <>
          {chat !== emptyChat && (
            <div>
              <div className="flex flex-col items-center justify-center gap-10 mt-20">
                <h1 className="font-bold text-2xl">
                  Te han invitado a la sesión{' '}
                  <b style={{ color: `hsl(var(--nextui-primary))` }}>
                    {chat.name}
                  </b>
                </h1>

                {requestStatus !== 'request send' ? (
                  <Button
                    color="primary"
                    onPress={() => {
                      onOpen();
                    }}
                  >
                    Solicitar acceso
                  </Button>
                ) : (
                  <Button isDisabled color="primary">
                    Solicitud enviada
                  </Button>
                )}
              </div>

              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        {questionName}
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
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          onPress={() => handleSave(onClose)}
                        >
                          Request to join
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          )}
          {chat === emptyChat && <div>Chat not found</div>}
        </>
      )}
    </>
  );
};

export default WaitToJoinPageAnonymous;
