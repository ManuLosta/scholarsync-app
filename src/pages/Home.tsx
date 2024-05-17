import CreatePostButton from '../components/post/CreatePostButton';
import { useFeed } from '../context/FeedContext.tsx';
import PostCard from '../components/feed/PostCard.tsx';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';

export default function Home() {
  const { state, fetchPosts } = useFeed();
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchPosts();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchPosts, state.page]);

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
        <div className="flex flex-col divide-y mt-4">{renderPosts}</div>
        <div ref={loaderRef}></div>
      </div>
    )
  );
}
