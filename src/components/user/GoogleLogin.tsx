import { Button } from '@nextui-org/react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa6';

export default function GoogleLogin() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  return (
    <Button onPress={() => login()} startContent={<FaGoogle />}>
      Iniciar con Google
    </Button>
  );
}
