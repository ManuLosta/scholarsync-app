import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useState,
  useEffect,
} from 'react';
import {
  feedReducer,
  initialState,
  FeedState,
  FeedAction,
  OrderType,
} from './feedReducer';
import api from '../api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { Question } from '../types/types';

interface FeedContextProps {
  state: FeedState;
  dispatch: Dispatch<FeedAction>;
  fetchPosts: (order: OrderType) => void;
  loading: boolean;
}

export const FeedContext = createContext<FeedContextProps | undefined>(
  undefined,
);

interface FeedProviderProps {
  children: ReactNode;
}

export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(feedReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const { user } = useAuth();

  const fetchPosts = (order: OrderType) => {
    if (state.order != order) {
      console.log('reseting');
      dispatch({ type: 'RESET_POSTS' });
      setOffset(0);
      dispatch({ type: 'SET_ORDER', payload: order });
    }

    if (user) {
      setLoading(true);
      api
        .get(`feeds?offset=${offset}&limit=20&id=${user.id}&type=${order}`)
        .then((res) => {
          const data: Question[] = res.data.body;
          if (data.length == 0) {
            dispatch({ type: 'SET_HAS_MORE', payload: false });
          } else {
            dispatch({ type: 'SET_POSTS', payload: data });
            setOffset(offset + 1);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {}, [offset]);

  return (
    <FeedContext.Provider value={{ state, dispatch, fetchPosts, loading }}>
      {children}
    </FeedContext.Provider>
  );
};
