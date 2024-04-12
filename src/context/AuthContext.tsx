import React, { createContext, useEffect, useState } from 'react';
import api from '../api.ts';

interface AuthContextType {
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  user: UserInfo | null;
  logOut: () => void;
  loading: boolean;
}

type UserInfo = {
  username: string;
  firstName: string;
  lastName: string;
  id: string;
};

const defaultContext: AuthContextType = {
  sessionId: null,
  setSessionId: () => {},
  user: null,
  logOut: () => {},
  loading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem('sessionId') || null,
  );
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    api
      .post('auth/refresh', {
        sessionId,
      })
      .then((res) => {
        const fetchUser = res.data;
        setUser(fetchUser);
      })
      .catch((err) => {
        localStorage.removeItem('sessionId');
        setSessionId(null);
        setUser(null);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const logOut = () => {
    setSessionId(null);
    setUser(null);
    localStorage.removeItem('sessionId');
  };

  return (
    <AuthContext.Provider
      value={{ sessionId, setSessionId, user, logOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
