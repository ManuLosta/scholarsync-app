import React, { createContext, useEffect, useState } from 'react';

interface AuthContextType {
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  user: UserInfo | null;
  logOut: () => void;
}

type UserInfo = {
  username: string;
  firstName: string;
  lastName: string;
  id: number;
};

const defaultContext: AuthContextType = {
  sessionId: null,
  setSessionId: () => {},
  user: null,
  logOut: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem('sessionId') || null,
  );
  const [user, setUser] = useState<UserInfo | null>(null);

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
            id: user.id,
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
    validateSession().then(() => console.log('Session validated'));
  }, [sessionId]);

  const logOut = () => {
    setSessionId(null);
    setUser(null);
    localStorage.removeItem('sessionId');
  };

  return (
    <AuthContext.Provider value={{ sessionId, setSessionId, user, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
