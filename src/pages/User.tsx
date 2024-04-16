import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Button } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth.ts';



type User = {
  userName: String;
  firstName: String;
  lastName: String;
  friends: string[];
  credits: Number;
  questions: Number;
  answer: Number;
  groups: string[];
  receivedFriendsRequest: string[] // Ids of who had send to the person a friend request. We need to check if we are there
}

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [textForButton, settextForButton] = useState("Agregar amigo");
  const auth = useAuth();
  const currentId = auth?.user?.id



  useEffect(() => {
    api.get(`users/profile/${id}`)
      .then(res => {
        
        const user: User = res.data;
        
        setUser(user);

      }).finally(() => setLoading(false))

  }, [id]);

  

  function setFriendStateInUseState(){

    // Set the FriendState
    // notFriends -> Its not a friend
    // friends -> Are friends
    // pending -> pending request

    if (currentId != undefined){

      if (user?.friends.includes(currentId)){ 
        settextForButton("Quitar Amigo")
      }

      else if (user?.receivedFriendsRequest.includes(currentId)) {
        settextForButton("Cancelar solicitud")
      
      }

    }


  }




  function sendFriendRequest(){
      // Hacer la llamada para hacer el friend request
      const data = {
        "from_id": currentId,
        "to_id": id
      }
      api
      .post("friend-requests/send-friend-request", data)
      .then((res) => {
        const sessionId = res.data;
        console.log(sessionId);
      })

  }

  useEffect(() => {

    setFriendStateInUseState()

  }, [user?.receivedFriendsRequest, user?.friends]);




  return loading ? (
    <div>
      Loading
    </div>
  ) : (
    <div className='flex-1 gap-5'>
      
      
    <h1>{user?.firstName} {user?.lastName}</h1>
      
    
      <p>{user?.userName}</p>
      
      <p>Puntos: {user?.credits.toString()}</p>

      <div>
      <p>Amigos: {user?.friends.length.toString()} Preguntas: {user?.questions.toString()} Respuestas: {user?.answer.toString()}</p>
  
      </div>
      
      <div>
        <h3>
          Grupos:
        </h3>
        <div>
            {user?.groups.map((str, index) => (
              <Button key={index}>{str}</Button>
            ))}
        </div>
      </div>
      <Button onClick={() => sendFriendRequest()} color='primary'>{textForButton}</Button>
      <Button color='secondary' >Invitar a grupo</Button>
      
    </div>
  )
}
