import CreatePostButton from '../components/post/CreatePostButton';
import { usePosts } from '../context/PostsContext.tsx';
import PostCard from '../components/feed/PostCard.tsx';
import { Link } from 'react-router-dom';

export default function Home() {
  const { posts, loading } = usePosts();

  return (
    !loading && (
      <div className="container p-8">
        <CreatePostButton />
        <div className="flex flex-col divide-y mt-4">
          {posts.map((post) => (
            <Link
              to={`question/${post.question.id}`}
              key={post.question.id}
              preventScrollReset={true}
            >
              <PostCard question={post.question} />
            </Link>
          ))}
        </div>
      </div>
    )
  );
}
