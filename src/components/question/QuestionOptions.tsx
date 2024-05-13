import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { LuMoreVertical, LuPencil, LuTrash } from 'react-icons/lu';
import api from '../../api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';

export default function QuestionOptions({
  questionId,
}: {
  questionId: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = () => {
    // delete question
    api
      .post('questions/delete-question', {
        question_id: questionId,
        user_id: user?.id,
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => console.error(err));
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="ghost" className="border-none rounded-full">
          <LuMoreVertical size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          onPress={() => navigate(`/question/${questionId}/edit`)}
          startContent={<LuPencil />}
        >
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
  );
}
