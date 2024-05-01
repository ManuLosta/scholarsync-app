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
import { useEffect, useState } from 'react';
import React from 'react';


interface Group {
  createdBy: string;
  description: string;
  id: string;
  isPrivate: boolean;
  title: string;
}

export default function AddToGroupButton({
  hisId
}:{
  hisId: string | undefined;
}) {   
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["2"]));
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [hisgroups, setHisGroups] = useState<Group[]>([]);
  
  const [groupsCanSendInvitation, SetGroupsCanSendInvitation] = useState<
    Group[]
  >([]);
  const [needFetch, setNeedFetch] = useState(false);
  const auth = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Que sea un grupo publico
  // Que vos seas el owner
  // Mostrar los grupos publicos y de los que sos el owner

  const fetchGropsInfo = (groupId: string | undefined) => {
    api
      .get(`groups/getGroup?group_id=${groupId}`)
      .then((res) => {

        console.log(res.data)

      })

      .catch((err) => {
        console.error('Error fetching groups', err);
      })
      

  };


  console.log()



  const fetchGroups = (userId: string | undefined, set: CallableFunction) => {
    api
      .get(`groups/getGroups?user_id=${userId}`)
      .then((res) => {
        const data = res.data;
        set(data);
        
      })

      .catch((err) => {
        console.error('Error fetching groups', err);
      })
      

  };


  function setGroupsWhoCanSendInvitation() {
    // Si es publico,
    // Si vos lo creaste
    // Si la persona no esta en el grupo ya
    if(myGroups != undefined){
      
      const fetchGroups = myGroups.filter((grup) => {
        fetchGropsInfo(grup.id)
        return (grup.createdBy === auth?.user?.id || !grup.isPrivate);
      });
      const gropswhoCanSendInvitation = fetchGroups.filter((grup) => {
        return ! hisgroups.some((hisG) => hisG.id === grup.id)
      });


      SetGroupsCanSendInvitation(gropswhoCanSendInvitation);
    }

  }

  useEffect(() => {
    fetchGroups(auth?.user?.id, setMyGroups);
    fetchGroups(hisId, setHisGroups);

    setGroupsWhoCanSendInvitation();
  }, [auth?.user?.id, needFetch]);

  function handleClick() {
    setNeedFetch(!needFetch);
    
    onOpen();
  }

  function handleInvitations(){
    console.log(selectedKeys)
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
      
      <Button onPress={() => handleClick()} color="secondary">
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={()=> handleInvitations()}>
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
