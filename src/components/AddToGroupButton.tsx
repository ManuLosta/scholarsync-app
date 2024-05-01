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

} from "@nextui-org/react";
import api from "../api";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import React from "react";


interface Group {
  createdBy: string;
  description: string;
  id: string;
  isPrivate: boolean;
  title: string;
}



export default function AddToGroupButton() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsCanSendInvitation, SetGroupsCanSendInvitation] = useState<Group[]>([]);
  const [needFetch, setNeedFetch] = useState(false);
  const auth = useAuth();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  

  // Que sea un grupo publico 
  // Que vos seas el owner
  // Mostrar los grupos publicos y de los que sos el owner
  //

  const fetchGroups = (userId: string | undefined) => {
    api
      .get(`groups/getGroups?user_id=${userId}`)
      .then((res) => {
        const data = res.data;
        setGroups(data);
      })
      .catch((err) => {
        console.error('Error fetching groups', err);
      })
      .finally(() =>{
      })
  };


  function setGroupsWhoCanSendInvitation(){
    // Si es publico,
    // Si vos lo creaste
    const fetchGroups = groups.filter((grup) => {
      return grup.createdBy === auth?.user?.id || !grup.isPrivate;
    });
    
    SetGroupsCanSendInvitation(fetchGroups)

    };
    


  


  useEffect(()=>{

    fetchGroups(auth?.user?.id)
    setGroupsWhoCanSendInvitation()
  }, [auth?.user?.id, needFetch])



  function handleClick(){
      setNeedFetch(!needFetch);
      
      onOpen()
    
  };


  const rows = groupsCanSendInvitation.map((grupo, index) => ({
    key: index.toString(),
    title: grupo.title,
    privacidad: grupo.isPrivate ? "Privado" : "Público",
  }));
  
  const columns = [
    {
      key: "title",
      label: "Nombre",
    },
    {
      key: "privacidad",
      label: "Es Privado",
    },
  ];





  return (
      <>
        <Button  onPress={()=> handleClick()} color="secondary">Invitar a grupo</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
          {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Agregar a grupo</ModalHeader>
            <ModalBody>
             <h1>Grupos:</h1>
            <Table 
              aria-label="Selection behavior table example with dynamic content"
              selectionMode="multiple"
              
              >
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
              )}
            </TableBody>
            </Table>
            </ModalBody>
              
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={onClose}>
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