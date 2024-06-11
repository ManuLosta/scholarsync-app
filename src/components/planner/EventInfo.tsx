import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { Event } from '../../types/types';
import EventForm from './EventForm';
import { useState } from 'react';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import api from '../../api';

export default function EventInfo({
  event,
  isOpen,
  onClose,
  onDelete,
  onEdit,
  isOwner = true,
}: {
  event?: Event;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (event: Event) => void;
  onEdit: (event: Event) => void;
  isOwner: boolean;
}) {
  const [edit, setEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = () => {
    if (event) {
      api
        .post('events/delete', event?.id)
        .then(() => {
          setIsDelete(false);
          onClose();
          onDelete(event);
        })
        .catch((err) => console.error('Error deleting event: ', err));
    }
  };

  const handleEdit = (newEvent: Event) => {
    setEdit(false);
    onEdit(newEvent);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onClose();
        setEdit(false);
      }}
    >
      <ModalContent>
        <ModalBody>
          {edit ? (
            <EventForm
              onClose={() => {
                onClose();
                setEdit(false);
              }}
              event={event}
              onCreate={handleEdit}
            />
          ) : (
            <div className="p-3 flex flex-col gap-2">
              <p className="font-bold text-lg">{event?.title}</p>
              <p>{event?.groupName}</p>
              <div className="flex gap-2 ms-auto">
                <Modal
                  isOpen={isDelete}
                  onOpenChange={() => setIsDelete(!isDelete)}
                >
                  <ModalContent>
                    <ModalHeader>¿Desea eliminar el evento?</ModalHeader>
                    <ModalBody>
                      <div className="flex gap-2 ms-auto">
                        <Button onPress={() => setIsDelete(false)}>
                          Cancelar
                        </Button>
                        <Button color="danger" onPress={handleDelete}>
                          Eliminar
                        </Button>
                      </div>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                {isOwner && (
                  <>
                    <Button isIconOnly={true} onPress={() => setIsDelete(true)}>
                      <LuTrash2 />
                    </Button>
                    <Button
                      startContent={<LuPencil />}
                      onPress={() => setEdit(true)}
                    >
                      Edit
                    </Button>
                  </>
                )}
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
