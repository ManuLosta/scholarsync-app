import { Answer, Profile } from '../../types/types';
import { useEffect, useState } from 'react';
import api from '../../api.ts';
import { Skeleton, User } from '@nextui-org/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MathExtension from '@aarkue/tiptap-math-extension';
import Carousel from './Carousel.tsx';

type Image = {
  base64Encoding: string;
  fileType: string;
};

export default function AnswerCard({ answer }: { answer: Answer }) {
  const [author, setAuthor] = useState<Profile | null>();
  const [images, setImages] = useState<Image[]>([]);

  const editor = useEditor({
    extensions: [StarterKit, MathExtension.configure({ evaluation: true })],
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose',
      },
    },
  });

  useEffect(() => {
    if (!answer) return;

    if (answer?.content) {
      editor?.commands.setContent(answer.content);
    }

    api.get(`users/profile/${answer.userId}`)
      .then(res => setAuthor(res.data))
      .catch(err => console.error(err));

    api.get(`answers/get-images?answerId=${answer.answerId}`)
      .then(res => {
        const data = res.data;
        console.log(data);
        setImages(data);
      })
      .catch(err => console.error(err));
  }, [answer, editor]);

  return (
    <div className="bg-foreground-100 rounded-lg p-4 flex flex-col">
      <div>
        {author ? (
          <User name={`${author.firstName} ${author.lastName}`} description={author.username} />
        ) : (
          <Skeleton />
        )}
      </div>
      <EditorContent editor={editor} />
      {images?.length > 0 && (
        <Carousel images={images.map(
          (image) =>
            `data:${image.fileType};base64,${image.base64Encoding}`,
        )} />
      )}
    </div>
  );
}