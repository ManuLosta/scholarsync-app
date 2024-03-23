import { z } from 'zod';
import { Button, Input, Link } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z
  .object({
    email: z.string().email({ message: 'Email inválido' }),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string().min(4, {
      message: 'El nombre de usuario debe tener al menos 4 caracteres',
    }),
    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    repeatPassword: z.string(), // add a validation here
    birthDate: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ['repeatPassword'],
    message: 'Las contraseñas no coinciden',
  });

type InputType = z.infer<typeof formSchema>;

const steps = [
  {
    title: 'Información de Cuenta',
    fields: ['email', 'username', 'password', 'repeatPassword'],
  },
  {
    title: 'Información Personal',
    fields: ['firstName', 'lastName', 'birthDate'],
  },
];

export default function RegisterForm() {
  const [page, setPage] = useState(0);
  const [prevPage, setPrevPage] = useState(0);
  const [visible, setVisible] = useState(false);

  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });

  type FieldName = keyof InputType;

  const next = async () => {
    const fields = steps[page].fields;
    const result = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!result) return;

    setPage(page + 1);
    setPrevPage(page);
  };

  const prev = () => {
    setPage(page - 1);
    setPrevPage(page);
  };

  const onSubmit = async (data: InputType) => {
    const res = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
      }),
    });

    console.log(res);
  };

  return (
    <>
      <form className="w-full max-w-[320px]" onSubmit={handleSubmit(onSubmit)}>
        {page === 0 && (
          <motion.div
            initial={{ x: prevPage == 1 ? 50 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-5"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email"
                  errorMessage={errors.email?.message?.toString()}
                  isInvalid={!!errors.email}
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre de Usuario"
                  errorMessage={errors.username?.message?.toString()}
                  isInvalid={!!errors.username}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Contraseña"
                  type={visible ? 'text' : 'password'}
                  errorMessage={errors.password?.message?.toString()}
                  isInvalid={!!errors.password}
                  endContent={
                    <Button
                      isIconOnly
                      className="bg-transparent"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? <EyeOff /> : <Eye />}
                    </Button>
                  }
                />
              )}
            />
            <Controller
              name="repeatPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Repetir Contraseña"
                  type={visible ? 'text' : 'password'}
                  errorMessage={errors.repeatPassword?.message?.toString()}
                  isInvalid={!!errors.repeatPassword}
                  endContent={
                    <Button
                      isIconOnly
                      className="bg-transparent"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? <EyeOff /> : <Eye />}
                    </Button>
                  }
                />
              )}
            />
            <Button color="primary" onClick={() => next()}>
              Siguiente
            </Button>
          </motion.div>
        )}

        {page === 1 && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-5"
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre"
                  errorMessage={errors.firstName?.message?.toString()}
                  isInvalid={!!errors.firstName}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Apellido"
                  errorMessage={errors.lastName?.message?.toString()}
                  isInvalid={!!errors.lastName}
                />
              )}
            />
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Fecha de Nacimiento"
                  type="date"
                  errorMessage={errors.birthDate?.message?.toString()}
                  isInvalid={!!errors.birthDate}
                />
              )}
            />

            <div className="flex gap-3 w-full">
              <Button onClick={() => prev()} className="w-1/2">
                Atras
              </Button>
              <Button color="primary" type="submit" className="w-1/2">
                Registrarse
              </Button>
            </div>
          </motion.div>
        )}
      </form>
      <p className="font-bold mt-5">
        ¿Ya tienes una cuenta? <Link href="/login">Inicia Sesión</Link>
      </p>
    </>
  );
}
