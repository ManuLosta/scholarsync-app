import { Button } from '@nextui-org/react';
import { LuPlus } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreatePostButton() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const handleCreatePost = () => {
    if (groupId) {
      navigate(`/new-post?groupId=${groupId}`);
    }
    navigate('/new-post');
  };

  return (
    <div className="flex justify-end">
      <Button onPress={handleCreatePost} variant="shadow" color="primary">
        <LuPlus />
        Crear pregunta
      </Button>
    </div>
  );
}
