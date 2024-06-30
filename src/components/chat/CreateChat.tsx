import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import NewChatForm from './NewChatForm.tsx';
import { useState } from 'react';
import SelectedPersons from './personsForChatBox/SelectedPersons.tsx';
import React from 'react';
import { useAuth } from '../../hooks/useAuth.ts';

export default function CreateChat({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPublic, setIsPublic] = useState(false);
  const [selectedPersons, setSelectedPersons] = React.useState<string[]>([]);
  const auth = useAuth();
  return (
    <>
      <Button className="my-3" onPress={onOpen}>
        Crear sessión en vivo
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Crear nueva sesión</ModalHeader>
              <ModalBody>
                <Checkbox isSelected={isPublic} onValueChange={setIsPublic}>
                  Publica
                </Checkbox>
                {!isPublic && (
                  <SelectedPersons
                    groupId={groupId}
                    selectedPersons={selectedPersons}
                    setSelectedPersons={setSelectedPersons}
                  />
                )}

                <NewChatForm
                  groupId={groupId}
                  userId={userId}
                  onClose={onClose}
                  isPublic={isPublic}
                  invitedUsers={
                    auth.user?.id === undefined
                      ? selectedPersons
                      : [...selectedPersons, auth.user?.id]
                  }
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
