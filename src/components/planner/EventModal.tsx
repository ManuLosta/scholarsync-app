import { useSubscription } from 'react-stomp-hooks';
import { useAuth } from '../../hooks/useAuth';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import NewChatForm from '../chat/NewChatForm';

export default function EventModal() {
  const { user } = useAuth();
  const { onOpenChange } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  const [groupId, setGroupId] = useState();
  const [eventTitle, setEventTitle] = useState('');

  useSubscription(`/individual/${user?.id}/calendar`, (message) => {
    const data = JSON.parse(message.body);
    console.log(data);
    setGroupId(data.groupId);
    setEventTitle(data.title);
    setIsOpen(true);
  });

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            Tienes el evento {eventTitle} a esta hora. ¿Quieres iniciar una
            session?
          </ModalHeader>
          <ModalBody>
            <NewChatForm
              groupId={groupId || ''}
              userId={user?.id || ''}
              onClose={() => setIsOpen(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
