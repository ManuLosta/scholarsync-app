import { useEffect, useState } from 'react';
import api from '../../api.ts';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Question } from '../../types/types';
import { Avatar, Image } from '@nextui-org/react';
import Carousel from './Carousel.tsx';
import { LuArrowLeft } from 'react-icons/lu';
import MathExtension from '@aarkue/tiptap-math-extension';
import QuestionSkeleton from './QuestionSkeleton.tsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import QuestionOptions from './QuestionOptions.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import FileDownloader from './FileDownloader.tsx';
import { Link } from 'react-router-dom';

type Image = {
  base64Encoding: string;
  fileType: string;
};

export default function QuestionCard({ question }: { question: Question }) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  dayjs.extend(relativeTime);
  dayjs.locale('es-us');

  const editor = useEditor({
    extensions: [StarterKit, MathExtension.configure({ evaluation: true })],
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert',
      },
    },
  });

  useEffect(() => {
    // fetch question images
    api
      .get(`questions/get-images?id=${question.id}`)
      .then((res) => {
        const data = res.data;
        setImages(data.body);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [question.id]);

  useEffect(() => {
    if (!question) return;

    // Set editor content
    if (question?.content) {
      editor?.commands.setContent(question.content);
    }
  }, [editor, question]);

  return !loading ? (
    <div className="p-4 flex gap-3 flex-col">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Link
            className="hover:bg-foreground-200 p-1 rounded-full"
            to=".."
            preventScrollReset={true}
          >
            <LuArrowLeft size={20} />
          </Link>
          <Avatar name={question.groupTitle} color="primary" />
          <div className="flex flex-col">
            <Link
              to={`/group/${question.groupId}`}
              className="font-bold hover:cursour-pointer text-foregorund"
            >
              {question.groupTitle}
            </Link>
            <Link
              to={`/user/${question.author.id}`}
              className="hover:cursour-pointer text-foregorund"
            >
              @{question.author.username}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-light">
            {dayjs(new Date(question.createdAt)).fromNow()}
          </p>
          {question.author.id == user?.id && (
            <QuestionOptions questionId={question.id} />
          )}
        </div>
      </div>
      <h1 className="text-2xl font-bold">{question.title}</h1>
      <EditorContent editor={editor} />
      {images.length > 0 && (
        <Carousel
          images={images.map(
            (image) => `data:${image.fileType};base64,${image.base64Encoding}`,
          )}
        />
      )}
      {question.files.length > 0 && <FileDownloader files={question.files} />}
    </div>
  ) : (
    <QuestionSkeleton />
  );
}
