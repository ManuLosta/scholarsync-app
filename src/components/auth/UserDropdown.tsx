import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { useAuth } from '../../hooks/useAuth.ts';
import ThemeSwitcher from '../navigation/ThemeSwitcher.tsx';
import api from '../../api.ts';
import { useCallback, useEffect, useState } from 'react';

export default function UserDropdown() {
  const auth = useAuth();
  const [profilePicture, setProfilePicture] = useState('');

  const getImg = useCallback(async () => {
    try {
      const response = await api.get(`/users/get-profile-picture`, {
        params: { user_id: auth?.user?.id },
      });

      const imageSrc = `data:image/png;base64,${response.data}`;
      return imageSrc;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, [auth?.user?.id]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const imgSrc = await getImg();
      setProfilePicture(imgSrc || '');
    };

    fetchProfilePicture();
  }, [getImg]);

  return (
    <Dropdown closeOnSelect={false} placement="bottom">
      <DropdownTrigger>
        <User
          name={`${auth?.user?.firstName} ${auth?.user?.lastName}`}
          description={`@${auth?.user?.username}`}
          avatarProps={{
            src: profilePicture,
          }}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem closeOnSelect={false}>
          <ThemeSwitcher />
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onPress={() => auth.logOut()}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
