import { Answer } from '../../types/types';
import AnswerCard from './AnswerCard.tsx';
import AnswerCardSkeleton from './AnswerCardSkeleton.tsx';

export default function AnswerList({ answers }: { answers: Answer[] | null }) {
  return answers ? (
    <div className="flex flex-col gap-4">
      {answers.map(answer => (
        <AnswerCard key={answer.answerId} answer={answer} isMine={false} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <AnswerCardSkeleton />
      <AnswerCardSkeleton />
      <AnswerCardSkeleton />
    </div>
  )
}