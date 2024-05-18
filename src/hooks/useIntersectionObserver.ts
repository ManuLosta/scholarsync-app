import { useState, useEffect } from 'react';

export default function useIntersectionObserver<T extends HTMLElement>(
  ref: React.RefObject<T>,
  options?: IntersectionObserverInit,
) {
  const [inViewport, setInViewport] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInViewport(entry.isIntersecting);
    }, options);
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, ref]);

  return inViewport;
}
