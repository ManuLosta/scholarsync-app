import { Button, Input, ModalFooter } from '@nextui-org/react';
import { LuPlus } from 'react-icons/lu';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

export default function CreateGlobalChatButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const userId = useAuth()?.user?.id || '';
  const [nameChat, setNameChat] = useState('');
  const [validity, setValidity] = useState(false);
  const navigate = useNavigate();

  function handleCreateChat() {
    handleValidity();
    if (validity) {
      console.log('user id: ', userId);
      api
        .post('global-chat/create', {
          name: nameChat,
          userId: userId,
        })
        .then((res) => {
          const chat = res.data;
          navigate(`/global-chat/${chat.chat_id}`);
        })
        .catch((err) => console.error('Error creating chat: ', err));
    }
  }
  function handleValidity() {
    setValidity(nameChat !== '');
  }

  const handleValidityCallback = useCallback(handleValidity, [nameChat]);

  useEffect(() => {
    handleValidityCallback();
  }, [handleValidityCallback]);

  return (
    <>
      <Button color="secondary" onPress={onOpen}>
        <LuPlus />
        Crear session Global
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Crear nueva sesión Global</ModalHeader>
              <ModalBody>
                <Input
                  isInvalid={!validity}
                  errorMessage="Escribi un nombre valido"
                  className="max-w-xs"
                  label="Nombre session"
                  placeholder="Nombre de session"
                  value={nameChat}
                  onValueChange={setNameChat}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>

                {!validity ? (
                  <Button isDisabled color="primary">
                    Crear
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onPress={() => {
                      handleCreateChat();
                      onClose();
                    }}
                  >
                    Crear
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
