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
} from '@nextui-org/react';
import SSIcon from '../assets/scholarsync.svg';
import { useAuth } from '../hooks/useAuth.ts';
import { SearchIcon } from 'lucide-react';

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
          startContent={<SearchIcon className="text-foreground-700" />}
          placeholder="Buscar en ScholarSync"
        />
      </NavbarContent>
      <NavbarContent justify="end">
        <Dropdown placement="bottom">
          <DropdownTrigger>
            <div className="flex flex-col justify-end">
              <p className="font-bold">
                {auth?.user?.firstName} {auth?.user?.lastName}
              </p>
              <p className="font-light">@{auth?.user?.username}</p>
            </div>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
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
