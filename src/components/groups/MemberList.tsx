import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { LuUsers } from 'react-icons/lu';
import UserPicture from '../user/UserPicture.tsx';
import { Profile } from '../../types/types';

export default function MemberList({ users }: { users: Profile[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <p
        className="font-light hover:cursor-pointer hover:text-primary hover:font-bold"
        onClick={onOpen}
      >
        {users?.length} miembros
      </p>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex gap-3 items-center">
            <LuUsers size={30} />
            <h1>Miembros</h1>
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-3 flex-col">
              {users?.map((user) => (
                <Link to={`/user/${user.id}`} key={user.id}>
                  <UserPicture
                    userId={user.id}
                    propForUser={{
                      name: `${user.firstName} ${user.lastName}`,
                      description: `@${user.username}`,
                    }}
                    hasPicture={user.hasPicture}
                  />
                </Link>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
