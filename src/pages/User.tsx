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
  firstName: String
  lastName: String
  userName: String
  credits: Number
  email: String
  friends: User[]
  id: String
  receivedFriendRequests: receivedFriendRequests[]

}


function alreadyFriends(user: User, id: String) {

  return user.friends.some((friend) => friend.id === id);
   
}

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

function friendRequestAlreadySend(user: User, id: String){


  const [friendRequest, setFriendRequest] = useState<receivedFriendRequests[]>();

  function makerequest(setFriendRequest: CallableFunction){

    api.get(`friend-requests/${id}/friend-requests`)

    .then(res => {
      
      setFriendRequest(res.data);
  
    }).finally(() => {
      
    })


  }

  makerequest(setFriendRequest);

  return friendRequest?.some((request) => request.from_id === id)

}


function aceptFriendRequest(user: User | undefined, id: String | undefined){

}

function userAlreadySendUsRequest(user: User, id: String){
    // Todo implement
    return false

  }



function setUpState(user: User | undefined, currentId: String | undefined, settextForButton: CallableFunction){

  if ((user != undefined) && (currentId != undefined)){

    if (alreadyFriends(user, currentId)) {

      settextForButton("Quitar Amigo")  

    }
    else if (friendRequestAlreadySend(user, currentId)){

      settextForButton("Pendiente")

      return

    }
    else if (userAlreadySendUsRequest(user, currentId)) {
        
      settextForButton("Aceptar solicitud")


    } else {settextForButton("Agregar amigo")}

  }

}

function DeleteFriends(user: User | undefined, currentId: String | undefined){}

function buntonEngine(user: User | undefined, currentId: String | undefined, settextForButton: CallableFunction, textForButton: String){
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
      aceptFriendRequest(user, currentId);
    break;
  }

  setUpState(user, currentId, settextForButton)


}



export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [textForButton, settextForButton] = useState("Agregar amigo");
  const auth = useAuth();
  const currentId = auth?.user?.id;
 


  useEffect(() => {
    api.get(`users/${id}`)
      .then(res => {
        
        setUser(res.data);
        setUpState(user, currentId, settextForButton)

      }).finally(() => setLoading(false))

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
      <p>Amigos: {user?.friends.length.toString()} </p>
    
      </div>
      
      <div>
        <h3>
          Grupos:
        </h3>

      </div>
      <Button onClick={() => buntonEngine(user, currentId, settextForButton, textForButton)} color='primary'>{textForButton}</Button>
      <Button color='secondary' >Invitar a grupo</Button>
      
    </div>
  )
}
