import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  User,
} from '@nextui-org/react';
import SSIcon from '../../assets/scholarsync.svg';
import { useAuth } from '../../hooks/useAuth.ts';
import { LuSearch } from 'react-icons/lu';

export default function Appbar() {
  const auth = useAuth();

  return (
    <Navbar maxWidth="full" isBordered isBlurred>
      <NavbarBrand>
        <Image src={SSIcon} width={40} height={40} />
        <h1 className="font-bold text-2xl">ScholarSync</h1>
      </NavbarBrand>
      <NavbarContent className="min-w-[400px]" justify="center">
        <Input
          startContent={<LuSearch className="text-foreground-700" />}
          placeholder="Buscar en ScholarSync"
        />
      </NavbarContent>
      <NavbarContent justify="end">
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
              onClick={() => auth.logOut()}
            >
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
