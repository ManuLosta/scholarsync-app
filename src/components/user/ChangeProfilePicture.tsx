import { Profile } from '../../types/types';
import api from '../../api.ts';
import { useCallback, useContext, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { useAuth } from '../../hooks/useAuth.ts';
import { AuthContext } from '../../context/AuthContext.tsx';

interface Props {
  profile: Profile | undefined;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

const ChangeProfilePicture: React.FC<Props> = ({ profile, setImage }) => {
  const auth = useAuth();
  const currentId = auth?.user?.id;
  const { updateHasPicture } = useContext(AuthContext);

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
        await getImg();
        updateHasPicture(true);
        console.log('new  in auth:', auth.user);
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
      const base64 = response.data.base64Encoding;
      const fileType = response.data.file.fileType;

      const imageSrc = `data:${fileType};base64,${base64}`;
      setImage(imageSrc);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, [auth.user?.hasPicture, profile, setImage]);

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
              accept="image/*"
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

export default ChangeProfilePicture;
