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
  const { user } = useAuth();

  const fetchPosts = (order: OrderType) => {
    if (state.order !== order) {
      dispatch({ type: 'RESET_POSTS' });
      dispatch({ type: 'SET_ORDER', payload: order });
      dispatch({ type: 'SET_PAGE', payload: 0 });
    }

    const currentPage = state.order !== order ? 0 : state.page;
    const posts = state.order !== order ? [] : state.posts;

    if (user) {
      setLoading(true);
      api
        .get(`feeds?offset=${currentPage}&limit=20&id=${user.id}&type=${order}`)
        .then((res) => {
          const data: Question[] = res.data.body;
          console.log(data.length);
          const newPosts = [
            ...posts.filter(
              (post) => !data.some((newPost) => newPost.id === post.id),
            ),
            ...data,
          ];
          if (data.length == 0) {
            dispatch({ type: 'SET_HAS_MORE', payload: false });
          } else {
            dispatch({ type: 'SET_POSTS', payload: newPosts });
            dispatch({ type: 'SET_PAGE', payload: currentPage + 1 });
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
