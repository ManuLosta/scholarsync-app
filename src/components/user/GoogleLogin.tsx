import { Button, Skeleton } from '@nextui-org/react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa6';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { useEffect, useState } from 'react';

export default function GoogleLogin() {
  const { googleToken, user, getGoogleToken, removeGoogleToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<string | null>(null);

  useEffect(() => {
    if (googleToken) {
      axios
        .get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: 'Bearer ' + googleToken,
          },
        })
        .then((res) => {
          setProfile(res.data.email);
        });
    }

    setLoading(false);
  }, [googleToken]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      axios
        .post('https://oauth2.googleapis.com/token', {
          code: tokenResponse.code,
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          grant_type: 'authorization_code',
          client_secret: import.meta.env.VITE_GOOGLE_SECRET,
          redirect_uri: 'http://localhost:5173',
        })
        .then((res) => {
          const data = res.data;
          getGoogleToken(res.data.refresh_token);
          api
            .post('users/load-refresh-token', {
              userId: user?.id,
              refreshToken: data.refresh_token,
            })
            .then((res) => console.log(res))
            .catch((err) =>
              console.error('Error authenticating with Google', err),
            );
        })
        .catch((err) => console.error('Error authenticating with Google', err));
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
    flow: 'auth-code',
  });

  const handleLogout = () => {
    api
      .post('users/delete-refresh-token', {
        userId: user?.id,
      })
      .then(() => {
        removeGoogleToken();
      })
      .catch((err) => console.error('Error loging out from google: ', err));
  };

  return loading ? (
    <div>
      <Skeleton className="w-[50px] h-1" />
    </div>
  ) : (
    <>
      {!googleToken ? (
        <Button onPress={() => login()} startContent={<FaGoogle />}>
          Iniciar con Google
        </Button>
      ) : (
        <div className="flex flex-col max-w-[200px] gap-2 p-1">
          <p className="flex items-center flex-wrap gap-1">
            <FaGoogle size={20} />
            {profile}
          </p>
          <Button onPress={handleLogout}>Desvincular</Button>
        </div>
      )}{' '}
    </>
  );
}
