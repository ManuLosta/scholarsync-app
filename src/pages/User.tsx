import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Button } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth.ts';
import ExampleComponent from '../components/ExampleComponent.tsx';

type receivedFriendRequests = {
  from_id: string
  to_id: string
}

interface Friend {
  [key: string]: any;
}

interface Group {
  [key: string]: any;
}

type User = {
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
  const [requestState, setRequestState] = useState<string>("");

  const cases = [
    'user/not-found', 'friend-request/person-already-send-us-friend-request', 'friend-request/already-sent', 'user/already-a-friend', 'user/can-send-request',
  ];


  function sendFriendRequest() {
    const data = {
      from_id: currentId,
      to_id: user?.id,
    };

    api
      .post('friend-requests/send-friend-request', data)
      .then(() => {
        setRequestState(cases[2])
      })
      .catch(err => console.error(err));
  }


  function makerequesState() {

    // Estados: 
    // Son amigos
    // El me envio una request a mi
    // la request esta pendiente
    // no son amigos

    // Son amigos:

    if (user?.friends.some(friend => friend.id === currentId)) {
      setRequestState(cases[3]);
      return;
    }

    // El me envio una request a mi
    api.get(`friend-requests/${currentId}/friend-requests`)
      .then(res => {
        const requests = res.data;
        for (const request of requests) {
          if (request.from == user?.id) {
            setRequestState(cases[1]);
            break;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // la request esta pendiente
    api.get(`friend-requests/${id}/friend-requests`)
      .then(res => {
        const data = res.data;
        for (const objeto of data) {
          if (objeto.from == currentId) {
            setRequestState(cases[2]);
            break;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setRequestState(cases[4]);
  }

  function buttonEngine() {
    switch (requestState) {
      case cases[4]:
        sendFriendRequest();
        break;
      case cases[3]:
        // Eliminar amigo Implementar en el futuro
        break;
      case cases[2]:
        // Pendiente, no hace nada, 
        // Quizas en el futuro, eliminar solicitud
        break;
      case cases[1]:
        break;
    }
    makerequesState();
  }

  function getButtonText(id: string): string {
    switch (id) {
      case "friend-request/already-sent":
        return "Pendiente"
      case "friend-request/person-already-send-us-friend-request":
        return "Aceptar solicitud"
      case "user/already-a-friend":
        return "Quitar amigo"
      default:
        return "Agregar amigo"
    }
  }

  useEffect(() => {
    api.get(`users/profile/${id}`)
      .then(res => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [id]);


  useEffect(() => {
    makerequesState()
    setLoading(false)
  }, [user]);


  return loading ? (

    <div>
      Loading
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
      <Button onClick={() => buttonEngine()} color="primary">{getButtonText(requestState)}</Button>
      <ExampleComponent userId={user?.id} myId={currentId} />
    </div>
  );
}
