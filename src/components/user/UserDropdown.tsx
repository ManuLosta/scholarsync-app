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

export default function UserDropdown() {
  const auth = useAuth();

  return (
    <Dropdown closeOnSelect={false} placement="bottom">
      <DropdownTrigger>
        <User
          name={`${auth?.user?.firstName} ${auth?.user?.lastName}`}
          description={`@${auth?.user?.username}`}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          classNames={{ base: 'hover:bg-background' }}
          key="user"
          textValue="user"
          className="hover:cursor-default"
        >
          {auth?.user && <ProfileCard user={auth?.user} />}
        </DropdownItem>
        <DropdownItem key="theme" textValue="theme" closeOnSelect={false}>
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
      </DropdownMenu>
    </Dropdown>
  );
}
