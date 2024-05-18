import CreatePostButton from '../components/post/CreatePostButton';
import PostCard from '../components/feed/PostCard.tsx';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver.ts';
import { useFeed } from '../hooks/useFeed.ts';

export default function Home() {
  const { state, fetchPosts, loading } = useFeed();
  const targetRef = useRef(null);
  const inViewport = useIntersectionObserver(targetRef, { threshold: 1 });

  useEffect(() => {
    if (state.posts.length == 0) fetchPosts();
  }, []);

  useEffect(() => {
    if (!loading && inViewport) fetchPosts();
  }, [inViewport]);

  const renderPosts = useMemo(
    () =>
      state.posts.map((post) => (
        <Link
          to={`question/${post.question.id}`}
          key={post.question.id}
          preventScrollReset={true}
        >
          <PostCard question={post.question} />
        </Link>
      )),
    [state.posts],
  );

  return (
    state.posts.length > 0 && (
      <div className="container p-8">
        <CreatePostButton />
        <div className="flex flex-col divide-y divide-foreground-200 mt-4">
          {renderPosts}
        </div>
        <div ref={targetRef}></div>
      </div>
    )
  );
}
