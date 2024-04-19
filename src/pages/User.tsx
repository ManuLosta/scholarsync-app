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
  [key: string]: unknown;
}

interface Group {
  [key: string]: unknown;
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


  function sendFriendRequest() {
    const data = {
      from_id: currentId,
      to_id: user?.id,
    };

    api
      .post('friend-requests/send-friend-request', data)
      .then(() => {
        setRequestState("friend-request/sent")
      })
      .catch(err => console.error(err));
  }


  function makerequesState() {

    // Estados: 
    // Son amigos
    // El me envio una request a mi
    // la request esta pendiente
    // no son amigos
    
    
    if (currentId == undefined || id == undefined){
      return
    }else {
      const data = {
        from_id: currentId,
        to_id: id,
      };
      console.log(data)
      api
        .post('friend-requests/get-request-status', data)
        .then((res) => {
          setRequestState(res.data.status)
          
        })
        .catch(err => console.error(err));
    }
    


  }

  function buttonEngine() {
    switch (requestState) {
      case "friend-request/not-sent":
        sendFriendRequest();
        break;
      case "friend-request/already-friends":
        // Eliminar amigo Implementar en el futuro
        break;
      case "friend-request/sent":
        // Pendiente, no hace nada, 
        // Quizas en el futuro, eliminar solicitud
        break;
      case "friend-request/received":
        break;
    }
    makerequesState();
  }

  function getButtonText(id: string): string {
    console.log("requestState:", requestState)
    switch (id) {
      case "friend-request/sent":
        return "Pendiente"
      case "friend-request/received":
        return "Aceptar solicitud"
      case "friend-request/already-friends":
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
      }
  )}, [id]);


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
