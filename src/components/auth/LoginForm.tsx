import { Button, Input, Link } from '@nextui-org/react';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import api from '../../api.ts';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
});

type InputType = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
   if (auth?.loading) {
     setLoading(false);
     navigate('/');
   }
  }, [auth?.loading] );

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);

    api
      .post('auth/login', data)
      .then((res) => {
        const sessionId = res.data;
        localStorage.setItem('sessionId', sessionId);
        auth.setSessionId(sessionId);
      })
      .catch((err) => {
        const error = err.response.data;
        handleError(error);
      })
  };

  const handleError = (error: string) => {
    console.log(error);
    if (error === 'auth/wrong-password') {
      setError('password', {
        type: 'custom',
        message: 'Contraseña incorrecta',
      });
    } else if (error === 'auth/user-not-found') {
      setError('email', { type: 'custom', message: 'Usuario no encontrado' });
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-7 w-full max-w-[320px]"
        onSubmit={handleSubmit(onSubmit)}
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
              isDisabled={loading}
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
              type={isVisible ? 'text' : 'password'}
              errorMessage={errors.password?.message?.toString()}
              isInvalid={!!errors.password}
              isDisabled={loading}
              endContent={
                <Button
                  isIconOnly
                  className="bg-transparent text-foreground-700"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <LuEyeOff size={25} /> : <LuEye size={25} />}
                </Button>
              }
            />
          )}
        />
        <Button isLoading={loading} color="primary" type="submit">
          Iniciar Sesión
        </Button>
      </form>
      <p className="font-bold mt-5">
        ¿No tienes una cuenta? <Link href="/register">Regístrate</Link>
      </p>
    </>
  );
}
