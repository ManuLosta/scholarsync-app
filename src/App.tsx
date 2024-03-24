import { NextUIProvider } from '@nextui-org/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoutes from './routes/ProtectedRoutes.tsx';

export default function App() {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </NextUIProvider>
  );
}
