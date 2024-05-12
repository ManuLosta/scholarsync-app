import { NextUIProvider } from '@nextui-org/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoutes from './routes/ProtectedRoutes.tsx';
import User from './pages/UserProfile.tsx';
import Group from './pages/Group.tsx';
import NewPost from './pages/NewPost.tsx';
import Question from './pages/Question.tsx';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/user/:id" element={<User />} />
              <Route path="/group/:groupId" element={<Group />} />
              <Route path="/:groupId/new-post" element={<NewPost />} />
              <Route path="/new-post" element={<NewPost />} />
              <Route path="/question/:id" element={<Question />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
