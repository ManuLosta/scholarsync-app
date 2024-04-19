import { useEffect, useState } from 'react';

import api from '../api.ts';
import { Button, CircularProgress } from '@nextui-org/react';



export default function FriendStatusButton({ userId, myId }: { userId: string | undefined, myId: string | undefined}) {
  
  
  const [loading, setLoading] = useState(true);
  const [requestState, setRequestState] = useState<string>("");

  

  

  
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
  


  function sendFriendRequest() {
    const data = {
      from_id: myId,
      to_id: userId,
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
    
    
    if (myId == undefined || userId == undefined){
      return
    }else {
      const data = {
        from_id: myId,
        to_id: userId,
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

  useEffect(() => {
    
      
    makerequesState()
    setLoading(false)
  

}, [myId, userId]);


  
  
  
  return loading ? (<CircularProgress />) : 
  ( <div>
        <Button onClick={() => buttonEngine()} color="primary">{getButtonText(requestState)}</Button>
    </div>
  
  );



  
}