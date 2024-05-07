import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function Carousel({ images }: { images: string[] }) {
  const [[page, direction], setPage] = useState([0, 0]);
  
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 100 : -100,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
        opacity: 0
      };
    }
  };

  return (
      <div className="relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img 
            className="absolute bg-black"
            key={page} 
            src={images[page]} 
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
          />
        </AnimatePresence>
        <div 
          onClick={() => paginate(-1)} 
          className="absolute left-4 z-10 bg-foreground bg-opacity-40 rounded-full text-background"
        >
          <LuChevronLeft size={25} />
        </div>
        <div 
          onClick={() => paginate(1)}
          className="absolute right-4 z-10 bg-foreground bg-opacity-40 rounded-full text-background"
        >
          <LuChevronRight size={25} />
        </div>
        <div>

        </div>
      </div>
  )
}