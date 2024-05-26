import React, { useCallback, useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import TableOfGroups from './TableOfGroups';
import api from '../api';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../hooks/useAuth';

interface Invitation {
  group_id: string;
}

interface Group {
  createdBy: string;
  description: string;
  id: string;
  isPrivate: boolean;
  title: string;
}

export default function AddToGroupButton({
  hisId,
}: {
  hisId: string | undefined;
}) {
  const { groups } = useGroups();
  const auth = useAuth();
  const [disabledItems, setDisabledItems] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState<string[]>([]);
  const [groupsWhoCanSendInvite, setGroupsWhoCanSendInvite] = useState<Group[]>(
    [],
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchGroups = useCallback(
    async (userId: string | undefined): Promise<Group[] | undefined> => {
      try {
        const res = await api.get(`groups/getGroups?user_id=${userId}`);
        return res.data;
      } catch (err) {
        console.error('Error fetching groups', err);
        return undefined;
      }
    },
    [],
  );

  const getUserInvitations = useCallback(async (userId: string | undefined) => {
    try {
      const res = await api.get(`group-invitations/get-invitations/${userId}`);
      const invitations: Invitation[] = res.data;
      setDisabledItems(invitations.map((invite) => invite.group_id));
    } catch (err) {
      console.error('Error fetching invitations', err);
    }
  }, []);

  useEffect(() => {
    if (isOpen && hisId) {
      (async () => {
        const hisGroups = await fetchGroups(hisId);
        await getUserInvitations(hisId);
        if (groups && hisGroups) {
          const filteredGroups = groups.filter(
            (group) =>
              (group.createdBy === auth?.user?.id || !group.isPrivate) &&
              !disabledItems.includes(group.id) &&
              !hisGroups.some((hisGroup) => hisGroup.id === group.id),
          );
          setGroupsWhoCanSendInvite(filteredGroups);
        }
      })();
    }
  }, [
    isOpen,
    hisId,
    groups,
    auth?.user?.id,
    disabledItems,
    fetchGroups,
    getUserInvitations,
  ]);

  const sendInvitations = async (id: string, groupId: string) => {
    try {
      const res = await api.post('group-invitations/send-invitation', {
        user_id: id,
        group_id: groupId,
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = () => {
    onOpen();
  };

  const handleClose = () => {
    setGroupSelected([]);
  };

  const handleInvitations = () => {
    groupSelected.forEach((group) => {
      sendInvitations(hisId as string, group);
    });
    setGroupSelected([]);
  };

  return (
    <>
      <Button onPress={handleClick} color="secondary">
        Invitar a grupo
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar a grupo
              </ModalHeader>
              <ModalBody>
                <TableOfGroups
                  groups={groupsWhoCanSendInvite}
                  groupSelected={groupSelected}
                  setGroupSelected={setGroupSelected}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={handleInvitations}
                >
                  Invitar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
