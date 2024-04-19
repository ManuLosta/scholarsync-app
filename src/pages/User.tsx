import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { Button } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth.ts';
import { object } from 'zod';


type receivedFriendRequests = {
  from_id: String
  to_id: String
}

interface Friend {
  [key: string]: any;
}

interface Group {
  [key: string]: any;
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
  friends: Friend[];
  groups: Group[];
}





function DeleteFriends(user: User | undefined, currentId: String | undefined){}





export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [textForButton, settextForButton] = useState("Agregar amigo");
  const auth = useAuth();
  const currentId = auth?.user?.id;
  const [requestState, setRequestState] = useState<String>();  

  const cases = [
    "user/not-found", "friend-request/person-already-send-us-friend-request", "friend-request/already-sent", "user/already-a-friend", "user/can-send-request"
  ]


  function sendFriendRequest(){
  
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


  function makerequesState(){

    // Estados: 
    // Son amigos
    // El me envio una request a mi
    // la request esta pendiente
    // no son amigos

    // Son amigos:
    
    if (user?.friends.some(friend => friend.id === currentId)){
      setRequestState(cases[3])
      return
    }
    // El me envio una request a mi
    
    let data;

    api.get(`friend-requests/${currentId}/friend-requests`)
    .then(res => {
      data = res.data
      for (const objeto of data){
        if (objeto.to == currentId){
          setRequestState(cases[1])
          console.log("aceptar solicitud")
          return
        }
      }
      
    })
    .catch((err)=>{console.log(err)} )


    // la request esta pendiente

    api.get(`friend-requests/${id}/friend-requests`)
    .then(res => {
      data = res.data

      for (const objeto of data){
        if (objeto.from == currentId){
          console.log("pendiente")
          setRequestState(cases[2])
          return

        }
      }
      
    })
    .catch((err)=>{console.log(err)} )



    setRequestState(cases[4])
    console.log(" no pendiente")

    

  }




  function setUpState(){

   
    if ((user != undefined) && (currentId != undefined) && (requestState != undefined)){
    
      
  
       switch(requestState){
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

  function buntonEngine(){
    switch(requestState){

      case cases[4]:
        sendFriendRequest()
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
  
    makerequesState()
    setUpState()
  
  
  }


  useEffect(() => {
    
      api.get(`users/profile/${id}`)
      .then(res => {
        

        setUser(res.data)

        makerequesState() 
        setUpState()
      })
      .catch((err)=>{console.log(err)} )
      .finally(()=>{
        setLoading(false)
      })


  }, [id]);

  

  return loading ? (

    <div>
      Loading
    </div>
  ) : (
    
    <div className='flex gap-5 flex-col'>
     
      
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
      <Button onClick={() => buntonEngine()} color='primary'>{textForButton}</Button>
      <Button color='secondary' >Invitar a grupo</Button>
      
    </div>
  )
}
