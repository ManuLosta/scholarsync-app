import { createContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface CreditContextType {
  credits: number;
  xp: number;
  removeCredits: (count: number) => void;
  addCredits: (count: number) => void;
}

const defaultContext = {
  credits: 0,
  xp: 0,
  removeCredits: () => {},
  addCredits: () => {},
}

export const CreditContext = createContext<CreditContextType>(defaultContext);

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setCredits(user?.credits || 0)
    setXp(user?.xp || 0)
  }, [user])

  const removeCredits = (count: number) => {
    setCredits(credits - count)
  }

  const addCredits = (count: number) => {
    setCredits(credits + count)
  }

  return (
    <CreditContext.Provider value={{ credits, xp, removeCredits, addCredits }}>
        {children}
    </CreditContext.Provider>
  )
}

