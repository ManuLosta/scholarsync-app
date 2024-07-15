import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  useDisclosure,
} from '@nextui-org/react';
import { FaXTwitter } from 'react-icons/fa6';

export default function ShareChat({ chatId, chatName }: { chatId: string, chatName: string }) {
  const {isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
    <Button onPress={onOpen}>
      Compartir
    </Button>
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Comparte la sesión
            </ModalHeader>
            <ModalBody className="flex flex-col">
              <Snippet color="primary">{`http://localhost:5173/global-chat-external/${chatId}`}</Snippet>
              <a className='bg-black p-2 rounded-full text-white me-auto flex gap-2 items-center'
                href={`https://twitter.com/intent/tweet?text=%C3%9Anete+a+mi+nueva+sesi%C3%B3n+en+vivo+sobre+${chatName}+en+ScholarSync%21&url=http%3A%2F%2Flocalhost%3A5173%2Fglobal-chat-external%2F${chatId}`}
                target='_blank'
              >
                Compartir en
                <FaXTwitter color='white' />
              </a>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    </>
  );
}
