import { Question } from '../../types/types';
import { Link } from 'react-router-dom';

export default function PostCard({ question }: { question: Question }) {
  return (
    <Link
      to={`question/${question.id}`}
      key={question.id}
      preventScrollReset={true}
    >
      <div className="flex flex-col">
        <h2>{question.title}</h2>
      </div>
    </Link>
  );
}
