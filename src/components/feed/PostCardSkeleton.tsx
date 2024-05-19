import { Skeleton } from '@nextui-org/react';

export default function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex gap-2 flex-row">
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[150px] rounded-lg" />
          <Skeleton className="h-4 w-[100px] rounded-lg" />
        </div>
      </div>
      <Skeleton className="w-[80%] h-5 rounded-lg" />
      <Skeleton className="w-full h-4 rounded-lg" />
      <Skeleton className="w-[50%] h-4 rounded-lg" />
    </div>
  );
}
