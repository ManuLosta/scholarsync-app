import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useState,
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
  const { user } = useAuth();

  const fetchPosts = () => {
    if (user) {
      setLoading(true);
      api
        .get(
          `questions/get-questions-by-score?offset=${state.page}&limit=20&user_id=${user.id}`,
        )
        .then((res) => {
          const data: Post[] = res.data.body;
          if (data.length == 0) {
            dispatch({ type: 'SET_HAS_MORE', payload: false });
          } else {
            dispatch({ type: 'SET_POSTS', payload: data });
            dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <FeedContext.Provider value={{ state, dispatch, fetchPosts, loading }}>
      {children}
    </FeedContext.Provider>
  );
};
