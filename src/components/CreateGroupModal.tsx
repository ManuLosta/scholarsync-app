import { Button, Modal, ModalContent, useDisclosure, ModalHeader, ModalBody } from '@nextui-org/react';
import { LuPlus } from 'react-icons/lu';

export default function CreateGroupModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button variant="light" onPress={onOpen} startContent={<LuPlus size={25} />}>
        Crear grupo
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {
            (onClose) => (
              <>
              <ModalHeader>
                Crear grupo
              </ModalHeader>
              <ModalBody>
              </ModalBody>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </>
  )
}