import { z } from 'zod';
import { Button, Input, Link } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuEye, LuEyeOff } from 'react-icons/lu';

const formSchema = z.object({
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
});

type InputType = z.infer<typeof formSchema>;

const steps = [
  {
    id: 0,
    title: 'Información de Cuenta',
    fields: ['email', 'username', 'password', 'repeatPassword'],
  },
  {
    id: 1,
    title: 'Información Personal',
    fields: ['firstName', 'lastName', 'birthDate'],
  },
];

export default function RegisterForm() {
  const [page, setPage] = useState(0);
  const [prevPage, setPrevPage] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors },
    setError,
    getValues,
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();

  type FieldName = keyof InputType;

  const next = async () => {
    const fields = steps[page].fields;
    const result = await trigger(fields as FieldName[], { shouldFocus: true });

    if (getValues('password') !== getValues('repeatPassword')) {
      setError('repeatPassword', {
        type: 'custom',
        message: 'Las contraseñas no coinciden',
      });
      return;
    }

    if (!result) return;

    setPage(page + 1);
    setPrevPage(page);
  };

  const prev = () => {
    setPage(page - 1);
    setPrevPage(page);
  };

  const onSubmit = async (data: InputType) => {
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/register', {
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

      setLoading(false);

      if (!res.ok) {
        const error = await res.text();
        handleError(error);
      } else {
        const message = await res.text();
        console.log(message);
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleError = (error: string) => {
    console.log(error);
    if (error === 'auth/email-already-in-use') {
      setError('email', { type: 'custom', message: 'El email ya está en uso' });
    } else if (error === 'auth/username-already-in-use') {
      setError('username', {
        type: 'custom',
        message: 'El nombre de usuario ya está en uso',
      });
    } else if (error === 'auth/email-username-already-in-use') {
      setError('email', { type: 'custom', message: 'El email ya está en uso' });
      setError('username', {
        type: 'custom',
        message: 'El nombre de usuario ya está en uso',
      });
    }
    setPage(0);
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
                      className="bg-transparent text-foreground-700"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? <LuEyeOff size={25} /> : <LuEye size={25} />}
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
                      className="bg-transparent text-foreground-700"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? <LuEyeOff size={25} /> : <LuEye size={25} />}
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
                  isDisabled={loading}
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
                  isDisabled={loading}
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
                  isDisabled={loading}
                />
              )}
            />

            <div className="flex gap-3 w-full">
              <Button onClick={() => prev()} className="w-1/2">
                Atras
              </Button>
              <Button
                isLoading={loading}
                color="primary"
                type="submit"
                className="w-1/2"
              >
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
