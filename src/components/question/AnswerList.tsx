import { Answer } from '../../types/types';
import AnswerCard from './AnswerCard.tsx';

export default function AnswerList({ answers }: { answers: Answer[] }) {
  return (
    <div className="flex flex-col gap-4">
      {answers.map(answer => (
        <AnswerCard key={answer.answerId} answer={answer} />
      ))}
    </div>
  )
}