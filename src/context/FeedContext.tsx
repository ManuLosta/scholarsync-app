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
import { Question } from '../types/types';

interface FeedContextProps {
  state: FeedState;
  dispatch: Dispatch<FeedAction>;
  fetchPosts: (order: OrderType, id: string) => void;
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
  const [prevId, setPredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = (order: OrderType, id: string) => {
    const reset: boolean = state.order !== order || id !== prevId;

    if (reset) {
      setPredId(id);
      setLoading(true);
      dispatch({ type: 'SET_ORDER', payload: order });
      dispatch({ type: 'RESET_POSTS' });
    }

    const currentPage = reset ? 0 : state.page;
    const posts = reset ? [] : state.posts;

    api
      .get(`feeds?offset=${currentPage}&limit=20&id=${id}&type=${order}`)
      .then((res) => {
        const data: Question[] = res.data.body;
        const newPosts = [
          ...posts.filter(
            (post) => !data.some((newPost) => newPost.id === post.id),
          ),
          ...data,
        ];
        if (data.length == 0 || (currentPage == 0 && newPosts.length < 20)) {
          dispatch({ type: 'SET_HAS_MORE', payload: false });
        }
        dispatch({ type: 'SET_POSTS', payload: newPosts });
        dispatch({ type: 'SET_PAGE', payload: currentPage + 1 });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <FeedContext.Provider value={{ state, dispatch, fetchPosts, loading }}>
      {children}
    </FeedContext.Provider>
  );
};
