import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { CircularProgress } from '@nextui-org/react';
import { User } from '@nextui-org/react';
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

export type UserProfile = {
  firstName: string;
  lastName: string;
  username: string;
  credits: number;
  email: string;
  birthDate: string;
  createdAt: string;
  id: string;
  receivedFriendRequests: receivedFriendRequests[];
  friends: Friend[];
  groups: Group[];
}

export default function UserProfile() {
  const { id } = useParams();
  const [UserProfile, setUserProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const currentId = auth?.user?.id;





  useEffect(() => {
    api.get(`users/profile/${id}`)
      .then(res => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      }
    ).finally(()=> {setLoading(false)})


    
}, [id]);

  console.log(UserProfile)

  return loading ? (

    <div>
      <CircularProgress />
    </div>
  ) : (
    <div className="flex gap-8 flex-col justify-center align-center ml-20 mt-9">
      <div>
      <User
          
          name={`${UserProfile?.firstName} ${UserProfile?.lastName}`}
          description={`@${UserProfile?.username}`}
        />
      </div>


      <div className="flex gap-9 align-center">
        
        <p  className="text-2xl" >Puntos:  {UserProfile?.credits?.toString()}</p>
        <p className="text-2xl">Amigos:  {UserProfile?.friends?.length?.toString()}</p>
      </div>
      <div>
        <p className="text-2xl">
          Grupos:

        </p>
      </div>
      
      <FriendStatusButton userId={UserProfile?.id} myId={currentId} />
    </div>
  );
}
