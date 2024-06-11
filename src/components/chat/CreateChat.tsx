import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import NewChatForm from './NewChatForm.tsx';

export default function CreateChat({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                <NewChatForm
                  groupId={groupId}
                  userId={userId}
                  onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
