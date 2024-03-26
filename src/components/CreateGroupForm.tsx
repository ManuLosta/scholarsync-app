import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { LuLock, LuUsers } from 'react-icons/lu';

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

  const onSubmit = (data: InputType) => {
    console.log(data);
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
        <Button variant="flat" color="danger" onPress={onClose}>
          Cerrar
        </Button>
        <Button color="primary" type="submit">
          Crear grupo
        </Button>
      </div>
    </form>
  );
}
