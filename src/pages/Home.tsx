import CreatePostButton from '../components/post/CreatePostButton';
import PostCard from '../components/feed/PostCard.tsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver.ts';
import { useFeed } from '../hooks/useFeed.ts';
import PostCardSkeleton from '../components/feed/PostCardSkeleton.tsx';
import { Select, Selection, SelectItem } from '@nextui-org/react';
import { LuCalendar, LuStar } from 'react-icons/lu';

export default function Home() {
  const { state, fetchPosts, loading } = useFeed();
  const targetRef = useRef(null);
  const inViewport = useIntersectionObserver(targetRef, {
    rootMargin: '300px',
    threshold: 1,
  });
  const [order, setOrder] = useState<Set<string>>(new Set(['score-user']));

  useEffect(() => {
    console.log(order);
    if (!order.has(state.order) || state.posts.length == 0)
      fetchPosts(order.values().next().value);
  }, [order]);

  useEffect(() => {
    if (!loading && inViewport && state.hasMore)
      fetchPosts(order.values().next().value);
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
        <Select
          startContent={order.has('score-user') ? <LuStar /> : <LuCalendar />}
          defaultSelectedKeys={order}
          label="Ordenar"
          labelPlacement="outside"
          className="w-[200px]"
          onSelectionChange={(keys: Selection) => setOrder(keys as Set<string>)}
        >
          <SelectItem
            startContent={<LuStar />}
            key="score-user"
            value="score-user"
          >
            Relevancia
          </SelectItem>
          <SelectItem
            startContent={<LuCalendar />}
            key="date-user"
            value="date-user"
          >
            Fecha de carga
          </SelectItem>
        </Select>
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
