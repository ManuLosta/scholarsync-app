import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Select, SelectItem, User } from '@nextui-org/react';
import Editor from './Editor.tsx';
import FileUploader from './FIleUploader.tsx';
import api from '../../api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ConfirmModal from './ConfirmModal.tsx';

type Group = {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  createdBy: string;
};

const formSchema = z.object({
  title: z
    .string()
    .min(10, { message: 'El título debe tener al menos 10 caracteres.' }),
  body: z.string().min(8, { message: 'La pregunta es requerida' }),
  files: z.custom<File[]>().optional(),
});

type InputType = z.infer<typeof formSchema>;

export default function NewPostForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupError, setGroupError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    api
      .get(`groups/getGroups?user_id=${user?.id}`)
      .then((res) => {
        const data = res.data;
        setGroups(data);
      })
      .catch((err) => {
        console.error('Error fetching groups', err);
      });
  }, [user?.id]);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGroupError(null);
    if (event.target.value) navigate(`/${event.target.value}/new-post`);
    else navigate('/new-post');
  };

  const onSubmit: SubmitHandler<InputType> = (data) => {
    if (!groupId) {
      setGroupError('Debes seleccionar un grupo para publicar la pregunta');
      return;
    }

    if (data.files) {
      const bodyFormData = new FormData();
      bodyFormData.append('title', data.title);
      bodyFormData.append('content', data.body);
      bodyFormData.append('groupId', groupId || '');
      bodyFormData.append('authorId', user?.id || '');

      data.files.forEach((file: File) => {
        bodyFormData.append(`files`, file);
      });

      api
        .post('questions/publish-question', bodyFormData, {
          headers: { 'Content-Type': `multipart/form-data` },
        })
        .then((res) => {
          const id = res.data.body.id;
          handleNavigate(id);
        })
        .catch((err) => console.error(err));
    } else {
      api
        .post('questions/publish-no-doc-question', {
          title: data.title,
          content: data.body,
          groupId: groupId,
          authorId: user?.id,
        })
        .then((res) => {
          const id = res.data.body.id;
          handleNavigate(id)
        })
        .catch((err) => console.error(err));
    }
  };

  const handleNavigate = (questionId: string) => {
      navigate(`/question/${questionId}`)
  }

  return (
    groups && (
      <form
        className="flex flex-col gap-4 mt-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Select
          classNames={{
            base: 'max-w-xs',
            trigger: 'h-14',
          }}
          errorMessage={groupError}
          isInvalid={!!groupError}
          className="mb-2"
          placeholder="Elige un grupo"
          label={<p className="text-lg mb-2 font-bold">Grupo</p>}
          labelPlacement="outside"
          items={groups}
          defaultSelectedKeys={groupId && [groupId]}
          onChange={handleGroupChange}
          renderValue={(items) => {
            return items.map((item) => (
              <User
                key={item.data?.id}
                avatarProps={{ color: 'primary' }}
                className="m-2"
                name={item.data?.title}
              />
            ));
          }}
        >
          {(group) => (
            <SelectItem key={group.id} textValue={group.id}>
              <User
                avatarProps={{ color: 'primary' }}
                name={group.title}
                description={group.description}
              />
            </SelectItem>
          )}
        </Select>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              size="lg"
              errorMessage={errors.title?.message}
              isInvalid={!!errors.title}
              label={<p className="font-bold text-lg">Titulo</p>}
              labelPlacement="outside"
              placeholder="Título de la nueva pregunta"
            />
          )}
        />
        <p className="font-bold text-lg">Pregunta</p>
        <Controller
          name="body"
          control={control}
          render={({ field: { onChange } }) => (
            <Editor error={errors.body?.message} onChange={onChange} />
          )}
        />
        <p className="font-bold text-lg">Archivos</p>
        <Controller
          name="files"
          control={control}
          render={({ field: { onChange } }) => (
            <FileUploader onChange={onChange} />
          )}
        />
        <ConfirmModal onSubmit={handleSubmit(onSubmit)} />
      </form>
    )
  );
}
