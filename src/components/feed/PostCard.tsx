import { Question } from '../../types/types';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MathExtension from '@aarkue/tiptap-math-extension';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from '@nextui-org/react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver.ts';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import api from '../../api.ts';
import Carousel from '../question/Carousel.tsx';

type Image = {
  base64Encoding: string;
  fileType: string;
};

export default function PostCard({ question }: { question: Question }) {
  const currRef = useRef(null);
  const isVisible = useIntersectionObserver(currRef, {
    rootMargin: '300px',
    threshold: 0.5,
  });
  const hasImages = question.files.some((file) =>
    file.file_type.includes('image'),
  );
  const [images, setImages] = useState<Image[]>([]);

  const editor = useEditor({
    extensions: [StarterKit, MathExtension.configure({ evaluation: true })],
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert',
      },
    },
    content: question.content,
  });

  dayjs.extend(relativeTime);
  dayjs.locale('es-us');

  useEffect(() => {
    if (isVisible && hasImages && images.length == 0)
      api
        .get(`questions/get-images?id=${question.id}`)
        .then((res) => {
          const data = res.data.body;
          setImages(data);
        })
        .catch((err) => console.log(err));
  }, [isVisible]);

  return (
    <div
      ref={currRef}
      className="hover:bg-foreground-100 flex flex-col px-3 py-4 gap-2"
    >
      <Link
        to={`question/${question.id}`}
        key={question.id}
        preventScrollReset={true}
      >
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar name={question.groupTitle} color="primary" />
            <div className="flex flex-col">
              <p>{question.groupTitle}</p>
              <p>@{question.author.username}</p>
            </div>
          </div>
          <p className="font-light">
            {dayjs(new Date(question.createdAt)).fromNow()}
          </p>
        </div>
        <h2 className="text-xl font-bold">{question.title}</h2>
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: question.content }}
          />
        )}
      </Link>
      {hasImages && (
        <Carousel
          images={images.map(
            (image) => `data:${image.fileType};base64,${image.base64Encoding}`,
          )}
        />
      )}
    </div>
  );
}
