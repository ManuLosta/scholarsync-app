import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfileProps, emptyUser } from './../context/ProfileContext';
import {getUserProfile} from './../context/ProfileContext'




export default function User() {
  const { id } = useParams();


  const userId: UserProfileProps = {
    id: `${id}`
  }


  const [data, setData] = useState(emptyUser);

  useEffect(() => {
    async function fetchData() {
      setData(await getUserProfile(userId));
    }
    fetchData()  
  
    }, [id]);




  return <div>{data.firstName}</div>;
}
