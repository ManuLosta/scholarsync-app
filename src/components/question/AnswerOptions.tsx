import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { LuMoreVertical, LuPencil, LuTrash } from 'react-icons/lu';
import api from '../../api.ts';
import { Answer } from '../../types/types';
import { useAuth } from '../../hooks/useAuth.ts';
import AnswerForm from './AnswerForm.tsx';

export default function AnswerOptions({
  answer,
  onDelete,
  onEdit,
}: {
  answer: Answer;
  onDelete: () => void;
  onEdit: (answer: Answer) => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { user } = useAuth();

  const handleDelete = () => {
    api
      .post('answers/delete', {
        user_id: user?.id,
        id: answer.answerId,
      })
      .then(() => onDelete())
      .catch((err) => console.error(err));
  };

  const handleEdit = (answer: Answer) => {
    onClose();
    onEdit(answer);
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="ghost"
            className="border-none rounded-full"
          >
            <LuMoreVertical size={20} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem onPress={onOpen} startContent={<LuPencil />}>
            Editar
          </DropdownItem>
          <DropdownItem
            onPress={handleDelete}
            startContent={<LuTrash />}
            color="danger"
          >
            Eliminar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        scrollBehavior="inside"
        size="4xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {isOpen && (
            <>
              <ModalHeader className="flex items-center gap-4">
                <LuPencil size={25} />
                <h2>Editar respuesta</h2>
              </ModalHeader>
              <ModalBody className="pb-4">
                <AnswerForm
                  edit={true}
                  answer={answer}
                  questionId={answer.questionId}
                  onPublish={handleEdit}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
