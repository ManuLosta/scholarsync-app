import { Button, Input, Link } from '@nextui-org/react';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { LuCheck, LuEye, LuEyeOff } from 'react-icons/lu';

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
  const [complete, setComplete] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();
  const auth = useAuth();

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      if (res.ok) {
        const sessionId = await res.text();
        localStorage.setItem('sessionId', sessionId);
        auth.setSessionId(sessionId);
        setComplete(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        const error = await res.text();
        handleError(error);
      }
    } catch (error) {
      console.error(error);
    }
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
        <Button
          isLoading={loading}
          color={!complete ? 'primary' : 'success'}
          type="submit"
        >
          {complete && <LuCheck />}
          Iniciar Sesión
        </Button>
      </form>
      <p className="font-bold mt-5">
        ¿No tienes una cuenta? <Link href="/register">Regístrate</Link>
      </p>
    </>
  );
}
