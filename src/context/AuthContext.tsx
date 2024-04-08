import React, { createContext, useEffect, useState } from 'react';

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
    const validateSession = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (res.ok) {
          const user = await res.json();
          setUser({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id.toString(),
          });
        } else {
          localStorage.removeItem('sessionId');
          setSessionId(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error validating session:', error);
        setSessionId(null);
      }
    };
    setLoading(true);
    validateSession().then(() => setLoading(false));
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
