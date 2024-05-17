import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import {
  feedReducer,
  initialState,
  FeedState,
  FeedAction,
  Post,
} from './feedReducer';
import api from '../api.ts';
import { useAuth } from '../hooks/useAuth.ts';

interface FeedContextProps {
  state: FeedState;
  dispatch: Dispatch<FeedAction>;
  fetchPosts: () => void;
}

const FeedContext = createContext<FeedContextProps | undefined>(undefined);

interface FeedProviderProps {
  children: ReactNode;
}

export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(feedReducer, initialState);
  const { user } = useAuth();

  const fetchPosts = () => {
    console.log('called');
    if (user) {
      api
        .get(
          `questions/get-questions-by-score?offset=${state.page}&limit=20&user_id=${user.id}`,
        )
        .then((res) => {
          const data: Post[] = res.data.body;
          dispatch({ type: 'SET_POSTS', payload: data });
          dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <FeedContext.Provider value={{ state, dispatch, fetchPosts }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = (): FeedContextProps => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
