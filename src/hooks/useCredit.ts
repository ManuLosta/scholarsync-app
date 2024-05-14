import { useContext } from 'react';
import { CreditContext } from '../context/CreditContext';

export const useCredit = () => {
  return useContext(CreditContext);
};
