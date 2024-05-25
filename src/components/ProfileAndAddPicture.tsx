import { Avatar } from '@nextui-org/react';
import { Profile } from '../types/types';
import api from '../api';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  profile: Profile | undefined;
}

const ProfileAndAddPicture: React.FC<Props> = ({ profile }) => {
  const [image, setImage] = useState<string>('');

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && profile) {
      const formData = new FormData();
      formData.append('picture', file);
      formData.append('user_id', profile.id);

      try {
        const response = await api.post(
          '/users/update-profile-picture',
          formData,
        );
        console.log(response.data);
        getImg();
      } catch (err) {
        console.error('Error updating profile picture:', err);
      }
    }
  };

  const getImg = useCallback(async () => {
    if (!profile) return;

    try {
      const response = await api.get(`/users/get-profile-picture`, {
        params: { user_id: profile.id },
      });

      const imageSrc = `data:image/png;base64,${response.data}`;
      setImage(imageSrc);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) getImg();
  }, [getImg, profile]);

  return (
    <>
      <Avatar
        src={image || ''}
        className="w-20 h-20 text-large"
        alt="Profile picture"
      />
      <input type="file" onChange={handleFileChange} />
    </>
  );
};

export default ProfileAndAddPicture;
