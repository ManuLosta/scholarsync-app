import { Button, Input } from '@nextui-org/react';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api.ts';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  name: z.string(),
});

type InputType = z.infer<typeof formSchema>;

export default function NewChatForm({
  groupId,
  userId,
  onClose,
}: {
  groupId: string;
  userId: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    api
      .post('chat/create-chat', {
        name: data.name,
        groupId,
        userId,
      })
      .then((res) => {
        const chat = res.data;
        navigate(`/chat/${chat.chat_id}`);
        onClose();
      })
      .catch((err) => console.error('Error creating chat: ', err));
  };

  return (
    <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Nombre de la session"
            type="text"
            errorMessage={errors?.name?.message?.toString()}
            isInvalid={!!errors?.name}
          />
        )}
      />
      <div className="flex ms-auto gap-3">
        <Button color="danger" variant="flat" onPress={onClose}>
          Cancelar
        </Button>
        <Button color="primary" type="submit">
          Crear sessión
        </Button>
      </div>
    </form>
  );
}
