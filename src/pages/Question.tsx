import QuestionCard from '../components/question/QuestionCard.tsx';
import AnswerForm from '../components/question/AnswerForm.tsx';
import { useEffect, useState } from 'react';
import { Answer, Question as QuestionType } from '../types/types';
import api from '../api.ts';
import { useParams } from 'react-router-dom';
import AnswerList from '../components/question/AnswerList.tsx';
import AnswerCard from '../components/question/AnswerCard.tsx';
import { useAuth } from '../hooks/useAuth.ts';

export default function Question() {
  const [question, setQuestion] = useState<QuestionType>();
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [myAnswer, setMyAnswer] = useState<Answer | null | undefined>();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    api
      .get(`questions/get-question?id=${id}`)
      .then((res) => {
        const data = res.data;
        setQuestion(data.body);
      })
      .catch((err) => console.error(err));

    api
      .get(`answers/answers-by-question?questionId=${id}`)
      .then((res) => {
        const data: Answer[] = res.data;
        console.log(data);
        setMyAnswer(data.find((answer) => answer.author.id == user?.id));
        setAnswers(data.filter((answer) => answer.author.id != user?.id));
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleAnswerPublish = (answer: Answer) => {
    setMyAnswer(answer);
  };

  const handleDeleteAnswer = () => {
    setMyAnswer(null);
  };

  return (
    question && (
      <div className="container py-4 px-6 flex flex-col gap-4">
        <QuestionCard question={question} />
        {question?.author.id != user?.id &&
          (myAnswer ? (
            <>
              <h2 className="font-bold">Tu respuesta</h2>
              <AnswerCard
                onDelete={() => handleDeleteAnswer()}
                answer={myAnswer}
                isMine={true}
                onEdit={handleAnswerPublish}
              />
            </>
          ) : (
            <AnswerForm
              onPublish={handleAnswerPublish}
              questionId={question.id}
            />
          ))}
        <h2 className="font-bold text-lg">Respuestas</h2>
        <AnswerList answers={answers} />
      </div>
    )
  );
}
