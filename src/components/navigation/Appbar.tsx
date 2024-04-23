import {
  Badge,
  Button,
  Image,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from '@nextui-org/react';
import SSIcon from '../../assets/scholarsync.svg';
import { LuBell, LuSearch } from 'react-icons/lu';
import UserDropdown from '../auth/UserDropdown.tsx';
import { useNotifications } from '../../hooks/useNotifications.ts';

export default function Appbar({ handleOpen }: { handleOpen: () => void }) {
  const { notifications } = useNotifications();

  return (
    <Navbar maxWidth="full" isBlurred>
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
        <NavbarItem className="me-3">
          <Badge
            isInvisible={notifications.length == 0}
            color="danger"
            content={notifications.length}
          >
            <Tooltip content="Notificaciones" closeDelay={200}>
              <Button
                className="text-foreground border-none"
                onPress={handleOpen}
                radius="full"
                isIconOnly
                variant="ghost"
              >
                <LuBell size={24} />
              </Button>
            </Tooltip>
          </Badge>
        </NavbarItem>
        <NavbarItem>
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
