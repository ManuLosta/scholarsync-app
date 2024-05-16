import CreatePostButton from '../components/post/CreatePostButton';
import { usePosts } from '../context/PostsContext.tsx';
import PostCard from '../components/feed/PostCard.tsx';

export default function Home() {
  const { posts, loading } = usePosts();

  return (
    !loading && (
      <div className="container p-6">
        <CreatePostButton />
        <div className="flex gap-2 flex-col divide-y mt-4">
          {posts.map((post) => (
            <PostCard question={post.question} />
          ))}
        </div>
      </div>
    )
  );
}
