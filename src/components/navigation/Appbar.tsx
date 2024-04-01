import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent, Tooltip,
  User,
} from '@nextui-org/react';
import SSIcon from '../../assets/scholarsync.svg';
import { useAuth } from '../../hooks/useAuth.ts';
import { LuBell, LuSearch } from 'react-icons/lu';

export default function Appbar({ handleOpen }: { handleOpen: () => void }) {
  const auth = useAuth();

  return (
    <Navbar maxWidth="full" isBlurred className={'z-0'}>
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
        <Tooltip content="Notificaciones" closeDelay={200}>
          <Button className="text-foreground border-none" onPress={handleOpen} isIconOnly variant="ghost">
            <LuBell
              size={25}
            />
          </Button>
        </Tooltip>
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
      </NavbarContent>
    </Navbar>
  );
}
