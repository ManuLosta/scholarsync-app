import QuestionCard from '../components/question/QuestionCard.tsx';
import AnswerForm from '../components/question/AnswerForm.tsx';
import { useEffect, useState } from 'react';
import { Answer, Question as QuestionType } from '../types/types';
import api from '../api.ts';
import { useParams } from 'react-router-dom';
import AnswerList from '../components/question/AnswerList.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import AnswerCard from '../components/question/AnswerCard.tsx';

export default function Question() {
  const [question, setQuestion] = useState<QuestionType>();
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [myAnswer, setMyAnswer] = useState<Answer | undefined>();
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

    api.get(`questions/get-answers-by-question?question_id=${id}`)
      .then(res => {
        const data: Answer[] = res.data.body;
        setMyAnswer(data.find(answer => answer.userId == user?.id));
        setAnswers(data.filter(answer => answer.userId != user?.id));
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleAnswerPublish = (answer: Answer) => {
    console.log(answer);
    setMyAnswer(answer);
  };

  return (
    <div className="container py-4 px-6 flex flex-col gap-4">
      <QuestionCard question={question} />
      {question?.authorId != user?.id && (
        myAnswer ? (
          <>
            <h2 className="font-bold">Tu respuesta</h2>
            <AnswerCard answer={myAnswer} isMine={true} />
          </>
        ) : (
          <AnswerForm onPublish={handleAnswerPublish} question={question} />
        ))}
      <h2 className="font-bold text-lg">Respuestas</h2>
      <AnswerList answers={answers} />
    </div>
  );
}
