import QuestionCard from '../components/question/QuestionCard.tsx';
import AnswerForm from '../components/question/AnswerForm.tsx';
import { useEffect, useState } from 'react';
import { Answer, Question as QuestionType } from '../types/types';
import api from '../api.ts';
import { useParams } from 'react-router-dom';

export default function Question() {
  const [question, setQuestion] = useState<QuestionType>();
  const { id } = useParams();

  useEffect(() => {
    api
      .get(`questions/get-question?id=${id}`)
      .then((res) => {
        const data = res.data;
        console.log(data.body);
        setQuestion(data.body);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleAnswerPublish = (answer: Answer) => {
    console.log(answer)
  }

  return (
    <div className="container py-4 px-6 flex flex-col gap-4">
      <QuestionCard question={question} />
      <AnswerForm onPublish={handleAnswerPublish} question={question} />
    </div>
  );
}
