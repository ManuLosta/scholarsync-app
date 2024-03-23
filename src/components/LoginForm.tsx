import { Button, Input, Link } from '@nextui-org/react';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
});

type InputType = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    console.log(json);

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
              endContent={
                <Button
                  isIconOnly
                  className="bg-transparent"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <EyeOff /> : <Eye />}
                </Button>
              }
            />
          )}
        />
        <Button color="primary" type="submit">
          Iniciar Sesión
        </Button>
      </form>
      <p className="font-bold mt-5">
        ¿No tienes una cuenta? <Link href="/register">Regístrate</Link>
      </p>
    </>
  );
}