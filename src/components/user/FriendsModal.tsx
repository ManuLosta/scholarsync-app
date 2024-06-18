import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { LuUsers } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import UserPicture from './UserPicture';

export default function FriendsModal({
  friends,
}: {
  friends: { id: string; firstName: string; username: string }[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <p
        className="text-lg hover:text-primary hover:cursor-pointer hover:font-bold"
        onClick={onOpen}
      >
        {friends.length} amigos
      </p>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center">
            <LuUsers size={25} />
            <h1>Amigos</h1>
          </ModalHeader>
          <ModalBody>
            <div>
              {friends.map((friend) => (
                <Link to={`/user/${friend.id}`} key={friend.id}>
                  <UserPicture
                    userId={friend.id}
                    propForUser={{
                      name: `${friend.firstName}`,
                      description: `@${friend.username}`,
                    }}
                    hasPicture={false}
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
