import axios from 'axios';


export interface UserInfoForProfile {
  
UserName: String;
firstName: String;
lastName: String;
friends: Number;
credits: Number;
questions: Number;
answer: Number;
groups: string[];

} 


export const emptyUser: UserInfoForProfile = {
  UserName: "",
  firstName: "",
  lastName: "",
  friends: 0,
  credits: 0,
  questions: 0,
  answer: 0,
  groups: []
};


export interface UserProfileProps {
  id: string;
}

let path = `http://localhost:8080`;

async function getUserInfo(id: String): Promise<UserInfoForProfile> {
  try {
  
    const response = await axios.get(`${path}/api/v1/users/profile/${id}`);
  
    return response.data as UserInfoForProfile;
  
  
  } catch (error) {
    
    console.error('Error in Fetch: ', error);
    throw error;
  
  }
}

export function getUserProfile(props: UserProfileProps){

  return(getUserInfo(props.id))

}



