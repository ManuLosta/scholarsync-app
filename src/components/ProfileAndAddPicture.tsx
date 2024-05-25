import { Profile } from '../types/types';
import api from '../api';
import { useCallback, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';

interface Props {
  profile: Profile | undefined;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileAndAddPicture: React.FC<Props> = ({ profile, setImage }) => {
  const auth = useAuth();
  const currentId = auth?.user?.id;

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
      {currentId === profile?.id && (
        <div className="className='hover:cursor-pointer'">
          <Button
            color="primary"
            variant="bordered"
            className="max-w-[150px] flex p-3 items-center hover:scale-105 hover:cursor-pointer"
          >
            Cambiar foto
            <input
              type="file"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
            />
          </Button>
        </div>
      )}
    </>
  );
};

export default ProfileAndAddPicture;
