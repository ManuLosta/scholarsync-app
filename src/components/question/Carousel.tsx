import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export default function Carousel({ images }: { images: string[] }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = ((page % images.length) + images.length) % images.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="bg-black relative rounded-lg flex overflow-hidden justify-center aspect-[16/9]  w-ful">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          className="h-full aspect-auto absolute mx-auto"
          key={page}
          src={images[imageIndex]}
          variants={variants}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <div
            onClick={() => paginate(-1)}
            className="hover:cursor-pointer absolute left-4 top-[45%] z-10 bg-foreground bg-opacity-40 rounded-full text-background"
          >
            <LuChevronLeft size={25} />
          </div>
          <div
            onClick={() => paginate(1)}
            className="hover:cursor-pointer absolute right-4 top-[45%] z-10 bg-foreground bg-opacity-40 rounded-full text-background"
          >
            <LuChevronRight size={25} />
          </div>
          <div className="bg-black bg-opacity-30 absolute z-10 bottom-2 rounded-full flex gap-2 p-2">
            {images.map((img, index) => (
              <div
                key={img}
                className={`w-[10px] h-[10px] rounded-full bg-white bg-opacity-20 ${imageIndex == index && 'bg-opacity-90'}`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
