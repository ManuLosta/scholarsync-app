import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Button, CircularProgress } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth.ts';
import FriendStatusButton from '../components/FriendStatusButton.tsx';

type receivedFriendRequests = {
  from_id: string
  to_id: string
}

interface Friend {
  [key: string]: unknown;
}

interface Group {
  [key: string]: unknown;
}

export type User = {
  firstName: string;
  lastName: string;
  userName: string;
  credits: number;
  email: string;
  birthDate: string;
  createdAt: string;
  id: string;
  receivedFriendRequests: receivedFriendRequests[];
  friends: Friend[];
  groups: Group[];
}

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const currentId = auth?.user?.id;





  useEffect(() => {
    api.get(`users/profile/${id}`)
      .then(res => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      }
    ).finally(()=> setLoading(false))


}, [id]);



  return loading ? (

    <div>
      <CircularProgress />
    </div>
  ) : (
    <div className="flex gap-5 flex-col">
      <h1>{user?.firstName} {user?.lastName}</h1>
      <p>{user?.userName}</p>
      <div>
        <p>Puntos: {user?.credits?.toString()}</p>
        <p>Amigos: {user?.friends?.length?.toString()}</p>
      </div>
      <div>
        <h3>
          Grupos:
          {user?.groups.map(group => (
            <Button key={group.id}>{group.name}</Button>
          ))}
        </h3>
      </div>
      
      <FriendStatusButton userId={user?.id} myId={currentId} />
    </div>
  );
}
