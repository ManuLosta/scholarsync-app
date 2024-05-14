import { useState } from 'react';
import { FaStar } from 'react-icons/fa6';

export default function AnswerRating({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <div
            key={i}
            className="p-[2px] hover:cursor-pointer"
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(ratingValue)}
          >
            <FaStar
              className={
                ratingValue <= (hover || rating)
                  ? 'text-yellow-400'
                  : 'text-foreground-300'
              }
              size={20}
            />
          </div>
        );
      })}
    </div>
  );
}
