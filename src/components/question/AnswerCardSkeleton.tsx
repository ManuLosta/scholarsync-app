import { Skeleton } from '@nextui-org/react';

export default function AnswerCardSkeleton() {
  return (
    <div className="flex flex-col p-4 gap-4 bg-foreground-100 rounded-lg">
      <div className="flex gap-3">
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[120px] h-[1em] rounded-full" />
          <Skeleton className="w-[100px] h-[1em] rounded-full" />
        </div>
      </div>
      <Skeleton className="w-[70%] h-[1em] rounded-full" />
    </div>
  )
}