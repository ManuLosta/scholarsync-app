import { useEffect, useState } from 'react';
import api from '../../api.ts';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Question } from '../../types/types';
import { Button, Image } from '@nextui-org/react';
import Carousel from './Carousel.tsx';
import { LuArrowLeft } from 'react-icons/lu';
import MathExtension from '@aarkue/tiptap-math-extension';
import QuestionSkeleton from './QuestionSkeleton.tsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import QuestionOptions from './QuestionOptions.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import FileDownloader from './FileDownloader.tsx';
import { Link, useNavigate } from 'react-router-dom';
import UserTooltip from '../user/UserTooltip.tsx';
import UserPicture from '../user/UserPicture.tsx';

type Image = {
  base64Encoding: string;
  fileType: string;
};

export default function QuestionCard({ question }: { question: Question }) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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
        setImages(data);
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
          <Button
            onPress={() => navigate(-1)}
            isIconOnly
            className="bg-background hover:bg-foreground-200 rounded-full"
          >
            <LuArrowLeft size={20} />
          </Button>

          <UserPicture
            userId={question.author.id} // Asumiendo que `userId` es una propiedad de `question`
            propForUser={{
              name: '',
              avatarProps: {
                color: 'primary',
              },
            }}
            hasPicture={question.author.hasPicture}
          />
          <div className="flex flex-col">
            <Link
              to={`/group/${question.groupId}`}
              className="font-bold hover:text-primary hover:cursour-pointer text-foregorund"
            >
              {question.groupTitle}
            </Link>
            <UserTooltip user={question.author}>
              <Link
                to={`/user/${question.author.id}`}
                className="hover:cursour-pointer text-foregorund hover:text-primary"
              >
                @{question.author.username}
              </Link>
            </UserTooltip>
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
