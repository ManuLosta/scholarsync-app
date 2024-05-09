import QuestionCard from '../components/question/QuestionCard.tsx';
import AnswerForm from '../components/question/AnswerForm.tsx';
import { useEffect, useState } from 'react';
import { Answer, Question as QuestionType } from '../types/types';
import api from '../api.ts';
import { useParams } from 'react-router-dom';
import AnswerList from '../components/question/AnswerList.tsx';

export default function Question() {
  const [question, setQuestion] = useState<QuestionType>();
  const [answers, setAnswers] = useState<Answer[]>([]);
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

    api.get(`questions/get-answers-by-question?question_id=${id}`)
      .then(res => {
        const data = res.data.body;
        setAnswers(data);
      })
      .catch(err => console.error(err))
  }, [id]);

  const handleAnswerPublish = (answer: Answer) => {
    console.log(answer);
    setAnswers([...answers, answer]);
  };

  return (
    <div className="container py-4 px-6 flex flex-col gap-4">
      <QuestionCard question={question} />
      <AnswerForm onPublish={handleAnswerPublish} question={question} />
      <AnswerList answers={answers} />
    </div>
  );
}
