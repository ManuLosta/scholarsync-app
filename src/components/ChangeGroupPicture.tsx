import api from '../api';

import { Button } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';

interface Props {
  groupId: string | undefined;
  getImg: CallableFunction;
}

const ChangeGroupPicture: React.FC<Props> = ({ groupId, getImg }) => {
  const auth = useAuth();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && groupId && auth.user?.id != undefined) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('group_id', groupId);
      formData.append('user_id', auth.user?.id);

      try {
        const response = await api.post('/groups/update-picture', formData);
        console.log(response.data);
        getImg();
      } catch (err) {
        console.error('Error updating profile picture:', err);
      }
    }
  };

  return (
    <>
      <div className="className='hover:cursor-pointer'">
        <Button
          color="primary"
          variant="bordered"
          className="mr-3 max-w-[150px] flex p-3 items-center hover:scale-105 hover:cursor-pointer"
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
    </>
  );
};

export default ChangeGroupPicture;
