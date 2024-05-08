import NewPostForm from '../components/post/NewPostForm.tsx';

export default function NewPost() {
  return (
    <div className="container p-6 flex flex-col gap-4">
      <div>
        <h1 className="font-bold text-2xl">Pregunta nueva</h1>
      </div>
      <NewPostForm />
    </div>
  );
}
