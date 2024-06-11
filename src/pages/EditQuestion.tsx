import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Input } from '@nextui-org/react';
import Editor from '../components/post/Editor.tsx';
import FileUploader from '../components/post/FIleUploader.tsx';
import { useEffect, useState } from 'react';
import { Question } from '../types/types';
import api from '../api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';

const formSchema = z.object({
  title: z
    .string()
    .min(10, { message: 'El título debe tener al menos 10 caracteres.' }),
  body: z.string().min(8, { message: 'La pregunta es requerida' }),
  files: z.custom<File[]>().optional(),
});

type InputType = z.infer<typeof formSchema>;

export default function EditQuestion() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });
  const [question, setQuestion] = useState<Question>();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<InputType> = (data) => {
    const bodyFormData = new FormData();
    bodyFormData.append('title', data.title);
    bodyFormData.append('content', data.body);
    bodyFormData.append('id', id || '');

    data.files &&
      data.files.forEach((file: File) => {
        bodyFormData.append(`files`, file);
      });

    api
      .post('questions/edit-question', bodyFormData)
      .then(() => {
        navigate(`/question/${id}`);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    api
      .get(`questions/get-question?id=${id}`)
      .then((res) => {
        const data = res.data;
        setQuestion(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (question && user && question?.author.id !== user?.id) {
      navigate(`/question/${id}`);
    }
  }, [id, navigate, question, user]);

  return (
    question && (
      <div className="p-6 container">
        <h1 className="text-2xl font-bold">Editar pregunta</h1>
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="title"
            control={control}
            defaultValue={question.title}
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
            defaultValue={question.content}
            render={({ field: { onChange } }) => (
              <div>
                <p className="font-bold text-lg mb-1">Pregunta</p>
                <Editor
                  defaultValue={question.content}
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
          <Button className="ms-auto" color="primary" type="submit">
            Editar
          </Button>
        </form>
      </div>
    )
  );
}
