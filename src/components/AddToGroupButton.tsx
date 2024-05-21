import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@nextui-org/react';

import api from '../api';
import { useAuth } from '../hooks/useAuth';
import { useState, useCallback } from 'react';
import React from 'react';

import { useGroups } from '../hooks/useGroups';

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
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const { groups } = useGroups();

  const [groupsCanSendInvitation, SetGroupsCanSendInvitation] = useState<
    Group[]
  >([]);

  const [disabledItems, setDisabledItems] = useState<string[]>([]);
  const auth = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Que sea un grupo publico
  // Que vos seas el owner
  // Mostrar los grupos publicos y de los que sos el owner

  const getUserInvitations = useCallback((userId: string | undefined) => {
    api.get(`group-invitations/get-invitations/${userId}`).then((res) => {
      const data = res.data;

      getDisabledItems(data);
    });
  }, []);

  function getDisabledItems(hisInvitations: Invitation[]) {
    if (hisInvitations != undefined && hisInvitations != null) {
      const disabledItems: string[] = [];
      hisInvitations.forEach((element) => {
        disabledItems.push(element.group_id);
      });
      setDisabledItems(disabledItems);
    }
  }
  const sendInvitations = (id: string, groupId: string) => {
    api
      .post('group-invitations/send-invitation', {
        user_id: id,
        group_id: groupId,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchGroups = (
    userId: string | undefined,
  ): Promise<Group[] | undefined> => {
    return api
      .get(`groups/getGroups?user_id=${userId}`)
      .then((res) => {
        console.log('grupos: ', res.data);
        const data = res.data;
        return data;
      })

      .catch((err) => {
        console.error('Error fetching groups', err);
        return undefined;
      });
  };

  const setGroupsWhoCanSendInvitation = useCallback(async () => {
    console.log('ejecute');
    const hisGroups = await fetchGroups(hisId);
    getUserInvitations(hisId);
    // Si es publico,
    // Si vos lo creaste
    // Si la persona no esta en el grupo ya
    if (groups != undefined && hisGroups !== undefined) {
      const fetchGroups = groups.filter((grup) => {
        return (
          (grup.createdBy === auth?.user?.id || !grup.isPrivate) &&
          !(grup.id in disabledItems)
        );
      });
      const gropswhoCanSendInvitation = fetchGroups.filter((grup) => {
        return !hisGroups.some((hisG) => hisG.id === grup.id);
      });

      SetGroupsCanSendInvitation(gropswhoCanSendInvitation);
    }
  }, [auth?.user?.id, disabledItems, getUserInvitations, groups, hisId]);

  function handleClick() {
    onOpen();
  }

  function handleInvitations() {
    if (hisId != undefined && hisId != null) {
      for (const element of selectedKeys) {
        sendInvitations(hisId, element);
        setSelectedKeys(new Set([]));
        setDisabledItems([...disabledItems, element]);
      }
    }
  }

  function handleClose() {
    setSelectedKeys(new Set([]));
  }

  const rows = groupsCanSendInvitation.map((grupo) => ({
    key: grupo.id,
    title: grupo.title,
    privacidad: grupo.isPrivate ? 'Privado' : 'Público',
  }));

  const columns = [
    {
      key: 'title',
      label: 'Nombre',
    },
    {
      key: 'privacidad',
      label: 'Es Privado',
    },
  ];

  return (
    <>
      <Button
        onPress={() => handleClick()}
        onClick={() => setGroupsWhoCanSendInvitation()}
        color="secondary"
      >
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
                <h1>Grupos:</h1>
                <Table
                  aria-label="Selection behavior table example with dynamic content"
                  selectionMode="multiple"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                  disabledKeys={disabledItems}
                >
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={rows}>
                    {(item) => (
                      <TableRow key={item.key}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  onClick={() => handleClose()}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={() => handleInvitations()}
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
