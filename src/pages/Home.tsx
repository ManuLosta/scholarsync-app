import { useAuth } from '../hooks/useAuth.ts';
import { Button } from '@nextui-org/react';

export default function Home() {
  const auth = useAuth();

  return (
    <div className="container">
      <p>sessionId: {auth?.sessionId}</p>
      <p>username: {auth?.user?.username}</p>
      <p>userId: {auth?.user?.id}</p>
      <Button onClick={() => auth.logOut()}>Log Out</Button>
    </div>
  );
}
