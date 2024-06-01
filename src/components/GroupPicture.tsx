import { User, UserProps } from '@nextui-org/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import api from '../api';

interface GroupPictureProps {
  groupId: string;
  propForUser: UserProps;
  hasPicture: boolean;
}

interface src {
  src: string;
}

export default function GroupUserPicture({
  hasPicture,
  propForUser,
  groupId,
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
        const response = await api.get(`/groups/get-picture`, {
          params: { group_id: groupId },
        });
        console.log('respuesta en group pic:', response);

        const base64 = response.data;
        const fileType = 'image/jpeg';

        const imageSrc = `data:${fileType};base64,${base64}`;

        setImgScr(imageSrc);
      } catch (error) {
        setImgScr('');
        console.error('Error in group fetching profile picture:', error);
      }
    }
  }, [groupId, hasPicture]);

  useEffect(() => {
    if (isVisible) {
      getImg();
    }
  }, [getImg, isVisible]);

  const referencia: src = {
    src: imgSrc,
  };

  return (
    <div ref={currRef} className="flex items-center">
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
