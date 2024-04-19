import { Avatar, Chip, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { LuUsers } from 'react-icons/lu';

type propsType = {
  users: {
    users: string;
    username: string;
    firstName: string;
    lastName: string;
  }[] | undefined;
}

export default function MemberList({ users }: propsType) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { user } = useAuth();
  const myId = user?.id

  return (
    <>
      <p className="font-light hover:cursor-pointer hover:text-primary hover:font-bold" onClick={onOpen} >{users?.length} miembros</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            <ModalHeader className="flex gap-3 items-center">
              <LuUsers size={30} />
              <h1>Miembros</h1>
            </ModalHeader>
            <ModalBody>
              <div>
                {users?.map(user => (
                  <Link to={`/user/${user.users == myId ? "me" : user.users}`}>
                    <div className="flex gap-3 items-center">
                      <Avatar name={user.firstName} />
                      <div>
                        <p className="font-bold text-lg">{user.firstName} {user.lastName}
                          {myId == user.users && <Chip className="ml-2" variant="flat" color="primary">Tú</Chip>}
                        </p>
                        <p className="font-light">@{user.username}</p>
                      </div>
                    </div>
                  </Link>

                ))}
              </div>
            </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}