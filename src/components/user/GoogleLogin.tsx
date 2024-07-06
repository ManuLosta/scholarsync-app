import { Button } from '@nextui-org/react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa6';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';

export default function GoogleLogin() {
  const { googleToken, user } = useAuth();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
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

  return !googleToken ? (
    <Button onPress={() => login()} startContent={<FaGoogle />}>
      Iniciar con Google
    </Button>
  ) : (
    <p>Tu cuenta se encuantra vinculada con Google</p>
  );
}
