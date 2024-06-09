import React from 'react';
import { Card, CardHeader, CardBody, Divider, Link } from '@nextui-org/react';
import UserPicture from '../../user/UserPicture'; // Asegúrate de importar UserPicture si aún no lo has hecho
import { Question } from '../../../types/types';

type QuestionCardProps = {
  question: Question;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return question != null && question != undefined ? (
    <Link href={`/question/${question.id}`}>
      <Card className="min-w-[300px]">
        <CardHeader className="flex gap-3">
          <UserPicture
            userId={question.author.id}
            propForUser={{ name: '' }}
            hasPicture={question.author.hasPicture}
          />
          <div className="flex flex-col">
            <p className="text-md">{question.title}</p>
            <p className="text-small text-default-500">
              @{question.groupTitle}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {question.content.substring(3, question.content.length - 4)}
        </CardBody>
      </Card>
    </Link>
  ) : undefined;
};

export default QuestionCard;
