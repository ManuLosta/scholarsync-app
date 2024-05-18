import Editor from '../post/Editor.tsx';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import FileUploader from '../post/FIleUploader.tsx';
import { Answer } from '../../types/types';
import { useAuth } from '../../hooks/useAuth.ts';
import api from '../../api.ts';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  content: z
    .string()
    .min(10, { message: 'Respuesta muy corta.' })
    .max(5000, { message: 'Respuesta muy larga,' }),
  files: z.custom<File[]>().optional(),
});

type InputType = z.infer<typeof formSchema>;

export default function AnswerForm({
  questionId,
  onPublish,
  edit = false,
  answer,
}: {
  questionId: string;
  onPublish: (answer: Answer) => void;
  edit?: boolean;
  answer?: Answer;
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });
  const [focused, setFocused] = useState<boolean>(edit);
  const { user } = useAuth();

  const onSubmit: SubmitHandler<InputType> = (data) => {
    const bodyFormData = new FormData();
    bodyFormData.append('content', data.content);
    bodyFormData.append('userId', user?.id || '');

    data.files &&
      data.files.forEach((file: File) => {
        bodyFormData.append(`files`, file);
      });

    if (edit) {
      bodyFormData.append('answerId', answer?.answerId || '');

      api
        .post('answers/edit', bodyFormData)
        .then((res) => {
          console.log(res.data);
          onPublish({
            ...res.data,
            ratings: [],
          });
        })
        .catch((err) => console.error(err));
    } else {
      bodyFormData.append('questionId', questionId || '');

      api
        .post('answers/answer-question', bodyFormData)
        .then((res) => {
          setFocused(false);
          onPublish({
            ...res.data,
            ratings: [],
          });
        })
        .catch((err) => console.error(err));
    }
  };

  return focused ? (
    <>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="content"
          control={control}
          defaultValue={answer?.content}
          render={({ field: { onChange } }) => (
            <Editor
              autoFocus
              onChange={onChange}
              defaultValue={answer?.content}
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
          {!edit && (
            <Button
              variant="flat"
              color="danger"
              onPress={() => setFocused(false)}
            >
              Cancelar
            </Button>
          )}
          <Button color="primary" variant="shadow" type="submit">
            {edit ? 'Editar' : 'Responder'}
          </Button>
        </div>
      </form>
    </>
  ) : (
    <div
      onClick={() => setFocused(true)}
      className="border border-foreground-200 rounded-full p-4 hover:cursor-text"
    >
      <p className="font-light">Responder</p>
    </div>
  );
}
