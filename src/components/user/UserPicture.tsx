import { User, UserProps } from '@nextui-org/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver.ts';
import api from '../../api.ts';

interface GroupPictureProps {
  userId: string;
  propForUser: UserProps;
  hasPicture: boolean;
}

interface src {
  src: string;
}

export default function UserPicture({
  propForUser,
  userId,
  hasPicture,
}: GroupPictureProps) {
  const [imgSrc, setImgScr] = useState<string>('');
  const currRef = useRef<HTMLDivElement | null>(null);

  const isVisible = useIntersectionObserver(currRef, {
    rootMargin: '300px',
    threshold: 0.5,
  });

  const getImg = useCallback(async () => {
    if (hasPicture) {
      try {
        const response = await api.get(
          `/users/get-profile-picture?user_id=${userId}`,
        );
        console.log('respuesta en user pic:', response);

        const base64 = response.data.base64Encoding;
        const fileType = response.data.file.fileType;

        const imageSrc = `data:${fileType};base64,${base64}`;

        setImgScr(imageSrc);
      } catch (error) {
        setImgScr('');
        console.error('Error in group fetching profile picture:', error);
      }
    }
  }, [hasPicture, userId]);

  useEffect(() => {
    if (isVisible) {
      getImg();
    }
  }, [getImg, isVisible, hasPicture]);

  const referencia: src = {
    src: imgSrc,
  };

  return (
    <div ref={currRef}>
      <User
        name={propForUser.name}
        description={propForUser.description}
        key={propForUser.key}
        className={propForUser.className}
        avatarProps={Object.assign({}, referencia, propForUser.avatarProps)}
      />
    </div>
  );
}
