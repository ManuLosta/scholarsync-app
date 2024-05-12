import { Skeleton } from '@nextui-org/react';

export default function GroupListSkeleton() {
  return (
    <div className="w-full p-2 flex gap-2 items-center">
      <Skeleton className="w-[40px] h-[40px] rounded-full" />
      <Skeleton className="h-[1em] w-[50%] rounded-full"/>
    </div>
  )
}