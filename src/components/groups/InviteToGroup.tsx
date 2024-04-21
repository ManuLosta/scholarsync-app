import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useAuth } from '../../hooks/useAuth.ts';
import { useEffect, useState } from 'react';
import api from '../../api.ts';

type User = {
  id: string;
  lastName: string;
  firstName: string;
  username: string;
};

export default function InviteToGroup({
  groupId,
  members,
  invitations,
}: {
  groupId: string;
  members: User[];
  invitations: { user_id: string }[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentInvites, setSentInvites] = useState<string[]>([]);

  useEffect(() => {
    setSentInvites(invitations.map((invite) => invite.user_id));
    api
      .get(`users/profile/${user?.id}`)
      .then((res) => {
        const data = res.data;
        setFriends(data.friends);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [invitations, user?.id]);

  const handleInvite = (id: string) => {
    api
      .post('group-invitations/send-invitation', {
        user_id: id,
        group_id: groupId,
      })
      .then((res) => {
        const data = res.data;
        setSentInvites([...sentInvites, id]);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Button onPress={onOpen}>Invitar</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Invitar amigo</ModalHeader>
          <ModalBody>
            <div className="flex gap-3 flex-col">
              {!loading && (
                <>
                  {friends
                    ?.filter((friend) => {
                      return !members.includes(friend);
                    })
                    .map((friend) => (
                      <div key={friend.id} className="flex justify-between">
                        <div className="flex gap-3">
                          <Avatar name={friend.firstName} />
                          <div>
                            <p className="font-bold">
                              {friend.firstName} {friend.lastName}
                            </p>
                            <p className="font-light">@{friend.username}</p>
                          </div>
                        </div>
                        {
                           sentInvites.includes(friend.id) ? (
                          <Button disabled>Pendiente</Button>
                        ) : (
                          <Button
                            color="primary"
                            onPress={() => handleInvite(friend.id)}
                          >
                            Invitar
                          </Button>
                        )}
                      </div>
                    ))}
                </>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
