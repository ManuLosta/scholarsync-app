import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { useAuth } from '../../hooks/useAuth.ts';

export default function UserDropdown() {
  const auth = useAuth();

  return (
    <Dropdown placement="bottom">
      <DropdownTrigger>
        <User
          name={`${auth?.user?.firstName} ${auth?.user?.lastName}`}
          description={`@${auth?.user?.username}`}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
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
