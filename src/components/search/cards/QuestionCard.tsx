import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Divider, Link } from '@nextui-org/react';
import UserPicture from '../../user/UserPicture'; // Asegúrate de importar UserPicture si aún no lo has hecho
import { Question } from '../../../types/types';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MathExtension from '@aarkue/tiptap-math-extension';
type QuestionCardProps = {
  question: Question;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [content, setContent] = useState('');
  const [questionTitle, SetQuestionTitle] = useState('');

  useEffect(() => {
    if (!question) return;
    if (question.title.length >= 20) {
      SetQuestionTitle(question.title.substring(0, 20) + '...');
    } else {
      SetQuestionTitle(question.title);
    }
  }, [question]);

  const editor = useEditor({
    extensions: [StarterKit, MathExtension.configure({ evaluation: true })],
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      const maxLength = 20;
      const currentContent = editor.getText();

      if (currentContent.length <= maxLength) {
        setContent(currentContent);
      } else {
        editor.commands.setContent(content + '...');
      }
    },
  });

  useEffect(() => {
    if (!question) return;

    // Set editor content
    if (question?.content) {
      editor?.commands.setContent(question.content.substring(0, 20));
    }
  }, [editor, question]);

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
            <p className="text-md">{questionTitle}</p>
            <p className="text-small text-default-500">
              @{question.groupTitle}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <EditorContent editor={editor} />
        </CardBody>
      </Card>
    </Link>
  ) : undefined;
};

export default QuestionCard;
