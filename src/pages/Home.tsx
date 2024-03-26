import { useAuth } from '../hooks/useAuth.ts';

export default function Home() {
  const auth = useAuth();

  return (
    <div className="container">
      <h1>Home</h1>
      <p>¡Hola, {auth?.user?.firstName}!</p>
    </div>
  );
}
