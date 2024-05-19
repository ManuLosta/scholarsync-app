import CreatePostButton from '../components/post/CreatePostButton';
import PostCard from '../components/feed/PostCard.tsx';
import { useEffect, useMemo, useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver.ts';
import { useFeed } from '../hooks/useFeed.ts';
import PostCardSkeleton from '../components/feed/PostCardSkeleton.tsx';

export default function Home() {
  const { state, fetchPosts, loading } = useFeed();
  const targetRef = useRef(null);
  const inViewport = useIntersectionObserver(targetRef, {
    rootMargin: '300px',
    threshold: 1,
  });

  useEffect(() => {
    if (state.posts.length == 0) fetchPosts();
  }, []);

  useEffect(() => {
    if (!loading && inViewport && state.hasMore) fetchPosts();
  }, [inViewport]);

  const renderPosts = useMemo(
    () => state.posts.map((post) => <PostCard question={post.question} />),
    [state.posts],
  );

  return (
    <div className="container p-8">
      <CreatePostButton />
      {loading && state.posts.length == 0 ? (
        <div className="flex flex-col gap-2 divide-y divide-foreground-200 mt-4">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-foreground-200 mt-4">
            {renderPosts}
          </div>
          <div ref={targetRef}>
            {!state.hasMore ? (
              <p className="font-bold text-xl justify-center mt-5 text-center">
                No hay más preguntas
              </p>
            ) : (
              <PostCardSkeleton />
            )}
          </div>
        </>
      )}
    </div>
  );
}
