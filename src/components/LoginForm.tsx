import { Button, Input } from '@nextui-org/react';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
});

type InputType = z.infer<typeof formSchema>;

export default function LoginForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    console.log(data);
  };

  return (
    <>
      <form
        className="flex flex-col gap-5 w-full max-w-[320px]"
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
              type="password"
              errorMessage={errors.password?.message?.toString()}
              isInvalid={!!errors.password}
            />
          )}
        />
        <Button color="primary" type="submit">
          Iniciar Sesión
        </Button>
      </form>
    </>
  );
}
