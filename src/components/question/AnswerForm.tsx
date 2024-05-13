import Editor from '../post/Editor.tsx';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import FileUploader from '../post/FIleUploader.tsx';
import { Answer, Question } from '../../types/types';
import { useAuth } from '../../hooks/useAuth.ts';
import api from '../../api.ts';

const formSchema = z.object({
  content: z.string(),
  files: z.custom<File[]>().optional(),
});

type InputType = z.infer<typeof formSchema>;

export default function AnswerForm({
  question,
  onPublish,
}: {
  question: Question;
  onPublish: (answer: Answer) => void;
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>();
  const [edit, setEdit] = useState<boolean>(false);
  const { user } = useAuth();

  const onSubmit: SubmitHandler<InputType> = (data) => {
    console.log(data);
    const bodyFormData = new FormData();
    bodyFormData.append('questionId', question?.id || '');
    bodyFormData.append('content', data.content);
    bodyFormData.append('userId', user?.id || '');
    bodyFormData.append('groupId', question?.groupId || '');

    data.files &&
      data.files.forEach((file: File) => {
        bodyFormData.append(`files`, file);
      });

    api
      .post('answers/answer-question', bodyFormData)
      .then((res) => {
        setEdit(false);
        onPublish({
          ...res.data,
          ratings: [],
        });
      })
      .catch((err) => console.error(err));
  };

  return edit ? (
    <>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="content"
          control={control}
          render={({ field: { onChange } }) => (
            <Editor
              autoFocus
              onChange={onChange}
              error={errors.content?.message}
            />
          )}
        />
        <Controller
          name="files"
          control={control}
          render={({ field: { onChange } }) => (
            <FileUploader onChange={onChange} />
          )}
        />
        <div className="ms-auto flex gap-3">
          <Button variant="flat" color="danger" onPress={() => setEdit(false)}>
            Cancelar
          </Button>
          <Button color="primary" variant="shadow" type="submit">
            Responder
          </Button>
        </div>
      </form>
    </>
  ) : (
    <div
      onClick={() => setEdit(true)}
      className="border rounded-full p-4 hover:cursor-text"
    >
      <p className="font-light">Responder</p>
    </div>
  );
}
