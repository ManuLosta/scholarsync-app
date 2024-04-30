import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Button,
    useDisclosure
  } from "@nextui-org/react";
  
import {Group} from "./groups/GroupList";


  export default function AddToGroupButton() {
    const [groups, setGroups] = useState<Group[]>([]);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    // Que sea un grupo publico 
    // Que vos seas el owner
    // Mostrar los grupos publicos y de los que sos el owner
    //
    

    return (
        <>
          <Button onPress={onOpen}>Open Modal</Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar a grupo</ModalHeader>
              <ModalBody>
               <h1>Grupos:</h1>


              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
            </ModalContent>
          </Modal>
        </>
      );
           

        

}