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
import EditQuestion from './pages/EditQuestion.tsx';
import Chat from './pages/Chat.tsx';
import Planner from './pages/Planner.tsx';
import WaitToJoinPageRegister from './components/globalChat/WaitToJoinPageRegister.tsx';
import WaitToJoinPageAnonymous from './components/globalChat/WaitToJoinPageAnonymous.tsx';
import { StompSessionProvider } from 'react-stomp-hooks';

export default function App() {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <StompSessionProvider url={'ws://localhost:8080/message-broker'}>
            <Routes>
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/user/:id" element={<User />} />
                <Route path="/group/:groupId" element={<Group />} />
                <Route path="/:groupId/new-post" element={<NewPost />} />
                <Route path="/new-post" element={<NewPost />} />
                <Route path="/question/:id" element={<Question />} />
                <Route path="/question/:id/edit" element={<EditQuestion />} />
                <Route path="/chat/:id" element={<Chat isGlobal={false} />} />
                <Route path="/planner" element={<Planner />} />
                <Route
                  path="global-chat/:id"
                  element={<WaitToJoinPageRegister />}
                ></Route>
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/global-chat-external/:id"
                element={<WaitToJoinPageAnonymous />}
              />
            </Routes>
          </StompSessionProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
