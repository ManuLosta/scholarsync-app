import { useAuth } from '../hooks/useAuth.ts';
import Navbar from '../components/Appbar.tsx';

export default function Home() {
  const auth = useAuth();

  return (
    <>
      <Navbar />
      <h1>Home</h1>
      <p>Session: {auth?.sessionId}</p>
      <p>UserId: {auth?.user?.id}</p>
    </>
  );
}
