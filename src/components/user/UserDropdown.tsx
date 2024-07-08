import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { useAuth } from '../../hooks/useAuth.ts';
import ThemeSwitcher from '../navigation/ThemeSwitcher.tsx';
import ProfileCard from './ProfileCard.tsx';
import { LuArrowLeftToLine } from 'react-icons/lu';
import { useCallback, useEffect, useState } from 'react';
import api from '../../api.ts';
import GoogleLogin from './GoogleLogin.tsx';

export default function UserDropdown() {
  const auth = useAuth();
  const [image, setImage] = useState<string>('');

  const getImg = useCallback(async () => {
    if (auth.user?.hasPicture) {
      try {
        const response = await api.get(`/users/get-profile-picture`, {
          params: { user_id: auth.user?.id },
        });
        const base64 = response.data.base64Encoding;
        const fileType = response.data.file.fileType;

        const imageSrc = `data:${fileType};base64,${base64}`;
        setImage(imageSrc);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    }
  }, [auth.user?.hasPicture, auth.user?.id]);

  useEffect(() => {
    getImg();
  }, [getImg, auth.user?.hasPicture]);

  return (
    <Dropdown closeOnSelect={false} placement="bottom">
      <DropdownTrigger>
        <User
          name={`${auth?.user?.firstName} ${auth?.user?.lastName}`}
          description={`@${auth?.user?.username}`}
          avatarProps={{
            src: image,
          }}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          isReadOnly
          classNames={{ base: 'hover:bg-background' }}
          key="user"
          textValue="user"
          className="hover:cursor-default"
        >
          {auth?.user && <ProfileCard user={auth?.user} />}
        </DropdownItem>
        <DropdownItem
          key="theme"
          textValue="theme"
          closeOnSelect={false}
          isReadOnly
        >
          <ThemeSwitcher />
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onPress={() => auth.logOut()}
          startContent={<LuArrowLeftToLine />}
        >
          Cerrar sesión
        </DropdownItem>
        <DropdownItem isReadOnly>
          <GoogleLogin />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
