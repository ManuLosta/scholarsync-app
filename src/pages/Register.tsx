import AuthLayout from '../components/AuthLayout.tsx';
import RegisterForm from '../components/RegisterForm.tsx';

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
