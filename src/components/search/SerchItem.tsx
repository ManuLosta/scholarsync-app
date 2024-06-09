import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { LuSearch } from 'react-icons/lu';

import SearchPage from './SearchPage';

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Input
        startContent={<LuSearch className="text-foreground-700" />}
        placeholder="Buscar en ScholarSync"
        onClick={() => onOpen()}
      />

      <Modal size={'5xl'} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <SearchPage></SearchPage>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
