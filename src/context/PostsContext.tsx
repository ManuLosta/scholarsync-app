import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api from '../api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { Question } from '../types/types'; // Adjust this import according to your structure

type Post = {
  question: Question;
  score: number;
};

type PostsContextType = {
  posts: Post[];
  loading: boolean;
  fetchPosts: () => void;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchPosts = () => {
    if (user) {
      setLoading(true);
      api
        .get(
          `questions/get-questions-by-score?offset=0&limit=20&user_id=${user.id}`,
        )
        .then((res) => {
          const data: Post[] = res.data.body;
          setPosts(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    console.log('reload');
    fetchPosts();
  }, [user]);

  return (
    <PostsContext.Provider value={{ posts, loading, fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
