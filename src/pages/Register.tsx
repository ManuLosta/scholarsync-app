import AuthLayout from '../components/auth/AuthLayout.tsx';
import RegisterForm from '../components/auth/RegisterForm.tsx';

export default function Register() {
  return (
    <>
      <AuthLayout
        title="Regístrate"
        description="Ingresa los datos para registrarte"
      >
        <RegisterForm />
      </AuthLayout>
    </>
  );
}
