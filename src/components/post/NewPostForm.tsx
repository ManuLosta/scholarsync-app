import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Input } from '@nextui-org/react';
import Editor from './Editor.tsx';
import FileUploader from './FIleUploader.tsx';
import api from '../../api.ts';
import { useAuth } from '../../hooks/useAuth.ts';

export default function NewPostForm() {
  const { handleSubmit, control } = useForm();
  const { user } = useAuth();

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    const bodyFormData = new FormData();
    bodyFormData.append('title', data.title);
    bodyFormData.append('content', data.body);
    bodyFormData.append('groupId', '05fffa08-6479-47c6-a363-39e66dd0fb56');
    bodyFormData.append('authorId', user?.id || '');
    //bodyFormData.append("files", data.files[0])

    console.log(typeof data.files[0]);

    data.files.forEach((file: File) => {
      bodyFormData.append(`files`, file as File);
    });

    api
      .post('questions/publish-question', bodyFormData, {
        headers: { 'Content-Type': `multipart/form-data` },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <form
      className="flex flex-col gap-4 mt-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            size="lg"
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
        render={({ field: { onChange } }) => <Editor onChange={onChange} />}
      />
      <Controller
        name="files"
        control={control}
        render={({ field: { onChange } }) => (
          <FileUploader onChange={onChange} />
        )}
      />
      <Button type="submit">Subir</Button>
    </form>
  );
}
