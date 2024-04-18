import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Button } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth.ts';


type receivedFriendRequests = {
  from_id: String
  to_id: String
}

type User = {
  firstName: String;
  lastName: String;
  userName: String;
  credits: Number;
  email: String;
  birthDate: String;
  createdAt: String;
  id: String;
  receivedFriendRequests: receivedFriendRequests[];
  friends: { [key: string]: string }; 
  groups: { [key: string]: string };
}

const cases = [
  "user/not-found", "friend-request/person-already-send-us-friend-request", "friend-request/already-sent", "user/already-a-friend", "user/can-send-request"
]



function sendFriendRequest(settextForButton: CallableFunction, user: User | undefined, currentId: String | undefined){
  
  if(user == undefined || currentId == undefined){
    return;
  }

  const data = {
    from_id: currentId,
    to_id: user?.id
  }
  
  api
  .post("friend-requests/send-friend-request", data)
  .then(() => {

    settextForButton("Pendiente")

  })

}

function setUpState(user: User | undefined, currentId: String | undefined, settextForButton: CallableFunction, state: String | undefined, cases: String[]){
  

  if ((user != undefined) && (currentId != undefined) && (state != undefined)){
  
    
    console.log(state)


     switch(state){
      case cases[0]:
        console.log("user-not-foud")
        break;
      case cases[1]:
        settextForButton("aceptar-Solicitud")
        break;
      case cases[2]:
        settextForButton("Pendiente")
      break;
      case cases[3]:
        settextForButton("quitar amigo")
        break;
      default:
        settextForButton("agregar amigo")
     }

  }

} 

//function sendFriendRequest(user: User | undefined, currentId: String | undefined){ console.log("solicitud enviada")}

function DeleteFriends(user: User | undefined, currentId: String | undefined){}

function buntonEngine(user: User | undefined, currentId: String | undefined, settextForButton: CallableFunction, textForButton: String, state: String | undefined, cases: String[]){
  switch(textForButton){
    case "Quitar Amigo":
      DeleteFriends(user, currentId)
      break;
    case "Agregar amigo":
      sendFriendRequest(settextForButton, user, currentId)
      break;
    case "Pendiente":
    break;
    case "Aceptar solicitud":
      //aceptFriendRequest(user, currentId);
    break;
  }

  setUpState(user, currentId, settextForButton, state, cases)


}



export default function User() {
  const { id } = useParams();
  console.log(id)
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [textForButton, settextForButton] = useState("Agregar amigo");
  const auth = useAuth();
  const currentId = auth?.user?.id;
  const [requestState, setRequestState] = useState<String>();  




  useEffect(() => {
    
    console.log(currentId)
    
      api.get(`users/profile/${id}`)
      .then(res => {
        

        setUser(res.data);
        //setUpState(user, currentId, settextForButton, requestState, cases)
        console.log(res.data)
      })

      api.get(`friend-requests/get-friendRequestState/${currentId}/${id}`)
      .then(res => {
        
        setRequestState(res.data);
        console.log(res.data)
  
      })
      .finally(() => setLoading(false))


  }, [id]);


  


  return loading ? (

    <div>
      Loading
    </div>
  ) : (
    
    <div className='flex gap-5 column'>
     
      
    <h1>{user?.firstName} {user?.lastName}</h1>
      
    
      <p>{user?.userName}</p>
      
      <p>Puntos: {user?.credits.toString()}</p>

      <div>
      <p>Amigos: {user?.friends.length.toString()}</p>
    
      </div>
      
      <div>
        <h3>
          Grupos:
        </h3>

      </div>
      <Button onClick={() => buntonEngine(user, currentId, settextForButton, textForButton, requestState, cases)} color='primary'>{textForButton}</Button>
      <Button color='secondary' >Invitar a grupo</Button>
      
    </div>
  )
}
