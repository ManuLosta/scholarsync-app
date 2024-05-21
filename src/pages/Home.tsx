import CreatePostButton from '../components/post/CreatePostButton';
import PostCard from '../components/feed/PostCard.tsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver.ts';
import { useFeed } from '../hooks/useFeed.ts';
import PostCardSkeleton from '../components/feed/PostCardSkeleton.tsx';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { OrderType } from '../context/feedReducer.ts';
import { LuCalendar, LuStar } from 'react-icons/lu';

export default function Home() {
  const { state, fetchPosts, loading } = useFeed();
  const targetRef = useRef(null);
  const inViewport = useIntersectionObserver(targetRef, {
    rootMargin: '300px',
    threshold: 1,
  });
  const [order, setOrder] = useState<OrderType>('score-user');

  useEffect(() => {
    console.log(order);
    if (order != state.order || state.posts.length == 0) fetchPosts(order);
  }, [order]);

  useEffect(() => {
    if (!loading && inViewport && state.hasMore) fetchPosts(order);
  }, [inViewport]);

  const renderPosts = useMemo(
    () =>
      state.posts.map((question) => (
        <PostCard key={question.id} question={question} />
      )),
    [state.posts],
  );

  return (
    <div className="container p-8">
      <div className="flex justify-between items-end">
        <Dropdown className="w-[150px]">
          <DropdownTrigger>
            <div className="flex gap-2 items-center hover:cursor-pointer">
              {order.includes('date') ? (
                <>
                  <LuCalendar />
                  <p>Fecha de carga</p>
                </>
              ) : (
                <>
                  <LuStar />
                  <p>Relevancia</p>
                </>
              )}
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Seleccionar orden de preguntas"
            onAction={(key) => setOrder(key as OrderType)}
          >
            <DropdownItem key="score-user">Relevancia</DropdownItem>
            <DropdownItem key="date-user">Fecha de carga</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <CreatePostButton />
      </div>
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
