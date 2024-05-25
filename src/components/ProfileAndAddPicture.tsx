import { Avatar } from '@nextui-org/react';
import { Profile } from '../types/types';
import api from '../api';
import { useEffect, useState } from 'react';

interface Image extends File {
  preview: string;
}

interface Props {
  profile: Profile | undefined;
}

const ProfileAndAddPicture: React.FC<Props> = ({ profile }) => {
  const [images, setImages] = useState<Image[]>([]);

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

  const getImg = async () => {
    if (!profile) return;

    try {
      const response = await api.get(`/users/get-profile-picture`, {
        params: { user_id: profile.id },
        responseType: 'blob',
      });

      const file: Image = response.data;
      setImages([Object.assign(file, { preview: URL.createObjectURL(file) })]);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  useEffect(() => {
    if (profile) getImg();
  }, [profile]);

  return (
    <>
      <Avatar
        src={images[0]?.preview || ''}
        className="w-20 h-20 text-large"
        alt={images[0]?.name || 'Profile picture'}
      />
      <input type="file" onChange={handleFileChange} />
    </>
  );
};

export default ProfileAndAddPicture;
