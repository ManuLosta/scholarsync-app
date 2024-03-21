import AuthLayout from '../components/AuthLayout.tsx';
import LoginForm from '../components/LoginForm.tsx';

export default function Login() {
  return (
    <>
      <AuthLayout
        title="Iniciar sesión"
        description="Ingresar los datos para ingresar sesión"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
}
