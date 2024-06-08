import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api.ts';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  name: z.string(),
});

type InputType = z.infer<typeof formSchema>;

export default function CreateChat({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

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
      })
      .catch((err) => console.error('Error creating chat: ', err));
  };

  return (
    <>
      <Button className="my-3" onPress={onOpen}>
        Crear sessión en vivo
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Crear nueva sesión</ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4 p-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
