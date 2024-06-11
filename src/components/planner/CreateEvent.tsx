import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { LuPlus } from 'react-icons/lu';
import EventForm from './EventForm';
import { Event } from '../../types/types';

export default function CreateEvent({
  onCreate,
}: {
  onCreate: (event: Event) => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        className="my-3"
        onPress={onOpen}
        startContent={<LuPlus />}
      >
        Crear evento
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Crear evento nuevo</ModalHeader>
              <ModalBody>
                <EventForm onClose={onClose} onCreate={onCreate} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
