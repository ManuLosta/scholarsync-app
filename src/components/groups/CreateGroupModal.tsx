import {
  Button,
  Modal,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalBody,
} from '@nextui-org/react';
import { LuPlus } from 'react-icons/lu';
import CreateGroupForm from './CreateGroupForm.tsx';
import { FaUsers } from 'react-icons/fa6';

export default function CreateGroupModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        variant="light"
        onPress={onOpen}
        startContent={<LuPlus size={25} />}
      >
        Crear grupo
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="p-6">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-4">
                <FaUsers size={35} />
                <div>
                  <h2 className="text-2xl">Crear grupo</h2>
                  <p className="font-light text-sm">
                    Crear grupo para compartir contenido sobre un tema.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <CreateGroupForm onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
