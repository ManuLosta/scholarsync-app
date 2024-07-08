import React, { createContext, useEffect, useState } from 'react';
import api from '../api.ts';
import { Profile } from '../types/types';
import axios from 'axios';

type User = {
  profile: Profile;
  refresh_token: string;
};

interface AuthContextType {
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  user: Profile | null;
  logOut: () => void;
  loading: boolean;
  updateHasPicture: (hasPicture: boolean) => void;
  googleToken: string | null;
  getGoogleToken: (refresh: string) => void;
  removeGoogleToken: () => void;
}

const defaultContext: AuthContextType = {
  sessionId: null,
  setSessionId: () => {},
  user: null,
  logOut: () => {},
  loading: true,
  updateHasPicture: () => {},
  googleToken: null,
  getGoogleToken: () => {},
  removeGoogleToken: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem('sessionId') || null,
  );
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const updateHasPicture = (hasPicture: boolean) => {
    if (user) {
      setUser({ ...user, hasPicture });
    }
  };

  const getGoogleToken = (refresh: string) => {
    axios
      .post('https://oauth2.googleapis.com/token', {
        refresh_token: refresh,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        grant_type: 'refresh_token',
        client_secret: import.meta.env.VITE_GOOGLE_SECRET,
      })
      .then((res) => {
        const data = res.data;
        setGoogleToken(data.access_token);
      });
  };

  const removeGoogleToken = () => {
    setGoogleToken(null);
  };

  useEffect(() => {
    setLoading(true);
    api
      .post('auth/refresh', {
        sessionId,
      })
      .then((res) => {
        const fetchUser: User = res.data;
        getGoogleToken(fetchUser.refresh_token);
        setUser(fetchUser.profile);
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
    api
      .post('auth/logout', { sessionId })
      .then(() => {
        setSessionId(null);
        setUser(null);
        localStorage.removeItem('sessionId');
      })
      .catch((err) => console.error(err));
  };

  return (
    <AuthContext.Provider
      value={{
        sessionId,
        setSessionId,
        user,
        logOut,
        loading,
        updateHasPicture,
        googleToken,
        getGoogleToken,
        removeGoogleToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
