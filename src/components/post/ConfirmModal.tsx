import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { RiCopperCoinFill } from 'react-icons/ri';

export default function ConfirmModal({ onSubmit }: { onSubmit: () => void }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className="ms-auto"
        variant="shadow"
        color="primary"
        onPress={onOpen}
      >
        Publicar
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h1>¿Desea publicar la pregunta?</h1>
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-2 w-full justify-end">
                  <Button variant="flat" color="danger" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      onClose();
                      onSubmit();
                    }}
                  >
                    Publicar
                    <div className="flex items-center justify-center text-danger">
                      <p>-20</p>
                      <RiCopperCoinFill className="mb-[1px] ms-1" />
                    </div>
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
