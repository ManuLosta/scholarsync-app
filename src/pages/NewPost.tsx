import { Input, Textarea } from '@nextui-org/react';

export default function NewPost() {
  return (
    <div className="container col-span-9 p-6 flex flex-col gap-4">
      <div>
        <h1 className="font-bold text-2xl">Pregunta nueva</h1>
      </div>
      <Input
        size="lg"
        className="font-bold"
        labelPlacement="outside"
        placeholder="¿Cuál es tu pregunta?"
        label="Título de la pregunta"
      />
      <Textarea label="Pregunta" />
    </div>
  );
}
