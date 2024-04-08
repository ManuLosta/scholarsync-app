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
import { useAuth } from '../../hooks/useAuth.ts';
import { LuBell, LuSearch } from 'react-icons/lu';
import UserDropdown from '../auth/UserDropdown.tsx';
import { useEffect, useState } from 'react';

export default function Appbar({ handleOpen }: { handleOpen: () => void }) {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/users/${user?.id}/friend-requests`,
        );

        if (res.ok) {
          const data = await res.json();
          const count = data.length;
          setNotificationCount(count);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificationCount();
    console.log(notificationCount);
  }, [notificationCount, user?.id]);

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
        <NavbarItem>
          <Badge color="danger" content={notificationCount}>
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
