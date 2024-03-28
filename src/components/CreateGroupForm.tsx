import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { LuLock, LuUsers } from 'react-icons/lu';
import { useAuth } from '../hooks/useAuth.ts';
import { useState } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  description: z
    .string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres' }),
  private: z.enum(['private', 'public']),
});

type InputType = z.infer<typeof formSchema>;

export default function CreateGroupForm({ onClose }: { onClose: () => void }) {
  const { handleSubmit, control } = useForm<InputType>();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: InputType) => {
    setLoading(true);
    const body = JSON.stringify({
      title: data.name,
      description: data.description,
      isPrivate: data.private === 'private',
      userId: auth.user?.id,
    });
    try {
      const res = await fetch('http://localhost:8080/api/v1/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (res.ok) {
        onClose();
      } else {
        const error = await res.text();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input {...field} label="Nombre del grupo" type="text" />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea {...field} label="Descripción" type="text" />
        )}
      />
      <Controller
        name="private"
        control={control}
        render={({ field: { onChange } }) => (
          <Select label="Privacidad" onChange={onChange}>
            <SelectItem value="public" key="public" textValue="Público">
              <div className="flex items-center gap-3">
                <LuUsers size={25} />
                <div>
                  <p className="font-bold">Público</p>
                  <p className="font-light">Cualquier usuario se puede unir.</p>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="private" key="private" textValue="Privado">
              <div className="flex items-center gap-3">
                <LuLock size={25} />
                <div>
                  <p className="font-bold">Privado</p>
                  <p className="font-light">
                    Solo usuarios invitados se pueden unir.
                  </p>
                </div>
              </div>
            </SelectItem>
          </Select>
        )}
      />
      <div className="grid grid-cols-2 gap-2">
        <Button variant="flat" color="danger" onClick={onClose}>
          Cerrar
        </Button>
        <Button color="primary" isLoading={loading} type="submit">
          Crear grupo
        </Button>
      </div>
    </form>
  );
}
