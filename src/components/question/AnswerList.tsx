import { Answer } from '../../types/types';
import AnswerCard from './AnswerCard.tsx';
import AnswerCardSkeleton from './AnswerCardSkeleton.tsx';
import { LuFileX2 } from 'react-icons/lu';

export default function AnswerList({ answers }: { answers: Answer[] | null }) {
  return answers ? (
    <div className="flex flex-col gap-4">
      {answers.length > 0 ? (
        answers.map((answer) => (
          <AnswerCard key={answer.answerId} answer={answer} isMine={false} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-4 gap-2 text-foreground-700">
          <LuFileX2 size={40} />
          <p className="text-center font-light">No hay respuestas</p>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <AnswerCardSkeleton />
      <AnswerCardSkeleton />
      <AnswerCardSkeleton />
    </div>
  );
}
