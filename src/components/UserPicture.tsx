import { User, UserProps } from '@nextui-org/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import api from '../api';

interface GroupPictureProps {
  userId: string;
  propForUser: UserProps;
}

interface src {
  src: string;
}

export default function UserPicture({
  propForUser,
  userId,
}: GroupPictureProps) {
  const [imgSrc, setImgScr] = useState<string>('');
  const currRef = useRef<HTMLDivElement | null>(null);

  const isVisible = useIntersectionObserver(currRef, {
    rootMargin: '300px',
    threshold: 0.5,
  });

  const getImg = useCallback(async () => {
    try {
      const response = await api.get(`/users/get-profile-picture`, {
        params: { user_id: userId },
      });
      console.log('respuesta en user pic:', response);

      const base64 = response.data.base64Encoding;
      const fileType = response.data.file.fileType;

      const imageSrc = `data:${fileType};base64,${base64}`;

      setImgScr(imageSrc);
    } catch (error) {
      setImgScr('');
      console.error('Error in group fetching profile picture:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (isVisible) {
      getImg();
    }
  }, [getImg, isVisible]);

  const referencia: src = {
    src: imgSrc,
  };

  return (
    <p ref={currRef}>
      <User
        name={propForUser.name}
        description={propForUser.description}
        key={propForUser.key}
        className={propForUser.className}
        avatarProps={Object.assign({}, referencia, propForUser.avatarProps)}
      />
    </p>
  );
}
