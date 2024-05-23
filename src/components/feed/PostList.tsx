import { useFeed } from '../../hooks/useFeed.ts';
import { useEffect, useMemo, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver.ts';
import { OrderType } from '../../context/feedReducer.ts';
import PostCard from './PostCard.tsx';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import CreatePostButton from '../post/CreatePostButton.tsx';
import PostCardSkeleton from './PostCardSkeleton.tsx';

export default function PostList({
  orders,
  defaultOrder,
  queryId,
}: {
  orders: { key: string; name: string; icon: React.ReactNode }[];
  defaultOrder: OrderType;
  queryId: string;
}) {
  const { state, fetchPosts, loading } = useFeed();
  const targetRef = useRef(null);
  const inViewport = useIntersectionObserver(targetRef, {
    rootMargin: '300px',
    threshold: 1,
  });
  const [order, setOrder] = useState<OrderType>(defaultOrder);
  const selected = orders.find((item) => item.key == order);

  useEffect(() => {
    fetchPosts(order, queryId);
  }, [order, queryId]);

  useEffect(() => {
    if (!loading && inViewport && state.hasMore) fetchPosts(order, queryId);
  }, [inViewport, queryId]);

  const renderPosts = useMemo(
    () =>
      state.posts.map((question) => (
        <PostCard key={question.id} question={question} />
      )),
    [state.posts],
  );

  return (
    <>
      <div className="flex justify-between items-end mt-3">
        <Dropdown className="w-[150px]">
          <DropdownTrigger>
            <div className="flex gap-2 items-center hover:cursor-pointer">
              {selected?.icon || <p></p>}
              <p>{selected?.name || ''}</p>
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Seleccionar orden de preguntas"
            onAction={(key) => setOrder(key as OrderType)}
          >
            {orders.map((order) => (
              <DropdownItem key={order.key} textValue={order.name}>
                <div className="flex items-center gap-1">
                  {order.icon}
                  <p>{order.name}</p>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <CreatePostButton />
      </div>
      {loading ? (
        <div className="flex flex-col gap-2 divide-y divide-foreground-200 mt-4">
          <PostCardSkeleton />
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-foreground-200 mt-4">
            {renderPosts}
          </div>
          <div ref={targetRef}>
            {!state.hasMore ? (
              <p className="justify-center mt-5 text-center">
                No hay más preguntas
              </p>
            ) : (
              <PostCardSkeleton />
            )}
          </div>
        </>
      )}
    </>
  );
}
