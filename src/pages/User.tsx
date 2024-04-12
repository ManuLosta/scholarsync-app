import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Button } from '@nextui-org/react';

type User = {
  id: string
  firstName: string;
  lastName: string;
  username: string;
}

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`users/${id}`)
      .then(res => {
        const user: User = res.data;
        setUser(user);
      }).finally(() => setLoading(false))

  }, [id]);

 return loading ? (
   <div>
     Loading
   </div>
 ) : (
    <div>
      <h1>{user?.firstName} {user?.lastName}</h1>
      <p>{user?.username}</p>
      <Button>Agregar amigo</Button>
      <Button>Invitar a grupo</Button>
    </div>
 )
}
