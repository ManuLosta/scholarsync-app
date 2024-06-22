import {
  Avatar,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { LuUsers } from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function GroupsModal({
  groups,
}: {
  groups: { id: string; title: string }[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <p
        onClick={onOpen}
        className="hover:font-bold hover:cursor-pointer hover:text-primary text-lg"
      >
        {groups.length} grupos
      </p>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex gap-3 items-center">
            <LuUsers size={25} />
            <h1>Grupos</h1>
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-3 flex-col">
              {groups.map((group) => (
                <Link
                  to={`/group/${group.id}`}
                  key={group.id}
                  className="flex gap-2 items-center hover:cursor-pointer hover:text-primary hover:font-bold"
                >
                  <Avatar name={group.title} />
                  {group.title}
                </Link>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
