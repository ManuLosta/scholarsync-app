import AuthLayout from '../components/auth/AuthLayout.tsx';
import LoginForm from '../components/auth/LoginForm.tsx';

export default function Login() {
  return (
    <>
      <AuthLayout
        title="Iniciar sesión"
        description="Ingresar los datos para iniciar sesión"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
}
