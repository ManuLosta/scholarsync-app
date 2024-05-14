import { Answer, Profile } from '../../types/types';
import { useEffect, useState } from 'react';
import api from '../../api.ts';
import { User } from '@nextui-org/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MathExtension from '@aarkue/tiptap-math-extension';
import Carousel from './Carousel.tsx';
import { FaStar } from 'react-icons/fa6';
import AnswerRating from './AnswerRating.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import AnswerCardSkeleton from './AnswerCardSkeleton.tsx';
import AnswerOptions from './AnswerOptions.tsx';

type Image = {
  base64Encoding: string;
  fileType: string;
};

export default function AnswerCard({
  answer,
  isMine,
  onDelete,
  onEdit,
}: {
  answer: Answer;
  isMine: boolean;
  onDelete?: () => void;
  onEdit?: (answer: Answer) => void;
}) {
  const { user } = useAuth();
  const [author, setAuthor] = useState<Profile | null>();
  const [images, setImages] = useState<Image[]>([]);
  const [userRating, setUserRating] = useState<number | null>(
    answer.ratings.find((rating) => rating.userId === user?.id)?.rating || null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const sum = answer.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  const [rating, setRating] = useState<number>(sum / answer.ratings.length);
  const [ratingCount, setRatingCount] = useState<number>(answer.ratings.length);

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

    api
      .get(`users/profile/${answer.userId}`)
      .then((res) => setAuthor(res.data))
      .catch((err) => console.error(err));

    api
      .get(`answers/get-images?answerId=${answer.answerId}`)
      .then((res) => {
        const data = res.data;
        setImages(data);
      })
      .catch((err) => console.error(err));

    setLoading(false);
  }, [answer, editor]);

  const handleRating = (newRating: number) => {
    setUserRating(newRating);
    api
      .post('answers/rate-answer', {
        answer_id: answer.answerId,
        user_id: user?.id,
        rating: newRating,
      })
      .then((res) => {
        const data = res.data;
        setRating(data.ratingAverage);
        setRatingCount(data.ratingCount);
      })
      .catch((err) => console.error(err));
  };

  return loading && author == null ? (
    <AnswerCardSkeleton />
  ) : (
    <div className="bg-foreground-100 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <User
          name={`${author?.firstName || ''} ${author?.lastName || ''}`}
          description={`@${author?.username || ''}`}
        />
        {isMine && onDelete && onEdit && (
          <AnswerOptions answer={answer} onDelete={onDelete} onEdit={onEdit} />
        )}
      </div>
      <EditorContent editor={editor} />
      {images?.length > 0 && (
        <Carousel
          images={images.map(
            (image) => `data:${image.fileType};base64,${image.base64Encoding}`,
          )}
        />
      )}
      <div className="flex justify-between">
        {ratingCount > 0 && (
          <div className="flex gap-2 items-center">
            <FaStar className="text-yellow-400" size={20} />
            <p>
              {rating.toPrecision(2)} ({ratingCount}){' '}
            </p>
          </div>
        )}
        {!isMine && (
          <AnswerRating rating={userRating || 0} setRating={handleRating} />
        )}
      </div>
    </div>
  );
}
