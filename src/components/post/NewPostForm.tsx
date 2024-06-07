import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Select, SelectItem } from '@nextui-org/react';
import Editor from './Editor.tsx';
import FileUploader from './FIleUploader.tsx';
import api from '../../api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ConfirmModal from './ConfirmModal.tsx';
import { useCredit } from '../../hooks/useCredit.ts';
import Group from '../../pages/Group.tsx';
import GroupUserPicture from '../groups/GroupPicture.tsx';

type Group = {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  createdBy: string;
  hasPicture: boolean;
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
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user } = useAuth();
  const { removeCredits } = useCredit();

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

    const bodyFormData = new FormData();
    bodyFormData.append('title', data.title);
    bodyFormData.append('content', data.body);
    bodyFormData.append('groupId', groupId || '');
    bodyFormData.append('authorId', user?.id || '');

    if (data.files) {
      data.files.forEach((file: File) => {
        bodyFormData.append(`files`, file);
      });
    }

    api
      .post('questions/publish-question', bodyFormData)
      .then((res) => {
        const id = res.data.id;
        console.log(res);
        handleNavigate(id);
        removeCredits(20);
      })
      .catch((err) => {
        const error = err.response.data;
        handleError(error);
      });
  };

  const handleError = (error: string) => {
    if (error === 'user/not-enough-credits') {
      setCreditsError('No tienes créditos suficientes');
    }
  };

  const handleNavigate = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  return (
    groups && (
      <form
        className="flex flex-col gap-4 mt-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {creditsError && (
          <div className="p-2 bg-danger-100 rounded-lg mb-2">
            <p className="text-danger">{creditsError}</p>
            <p className="text-danger font-light">
              Para conseguir más creditos responde preguntas de otros usuarios
            </p>
          </div>
        )}
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
              <GroupUserPicture
                groupId={item.data?.id || ''}
                propForUser={{
                  name: item.data?.title,
                  description: item.data?.description,
                  className: 'm-2',
                  avatarProps: { color: 'primary' },
                  key: item.data?.id,
                }}
                hasPicture={item.data?.hasPicture || false}
              />
            ));
          }}
        >
          {(group) => (
            <SelectItem key={group.id} textValue={group.id}>
              <GroupUserPicture
                groupId={group.id}
                hasPicture={group.hasPicture}
                propForUser={{
                  name: group.title,
                  description: group.description,
                  avatarProps: { color: 'primary' },
                }}
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
        <Controller
          name="body"
          control={control}
          render={({ field: { onChange } }) => (
            <div>
              <p className="font-bold text-lg mb-1">Pregunta</p>
              <Editor
                autoFocus={false}
                error={errors.body?.message}
                onChange={onChange}
              />
            </div>
          )}
        />
        <Controller
          name="files"
          control={control}
          render={({ field: { onChange } }) => (
            <div>
              <p className="font-bold text-lg mb-1">Archivos</p>
              <FileUploader onChange={onChange} />
            </div>
          )}
        />
        <ConfirmModal onSubmit={handleSubmit(onSubmit)} />
      </form>
    )
  );
}
