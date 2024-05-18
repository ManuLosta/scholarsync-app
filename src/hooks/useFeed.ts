import { useContext } from 'react';
import { FeedContext } from '../context/FeedContext.tsx';

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
