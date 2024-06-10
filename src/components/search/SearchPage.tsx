import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { LuSearch } from 'react-icons/lu';
import { useCallback, useEffect, useState } from 'react';
import { Group, Profile, Question } from '../../types/types';
import CustomTabs from './CustomTabs';
import SearchResult from './SearchResults';
import api from '../../api';

export default function SearchPage() {
  const [groupResult, setGroupResult] = useState<Group[]>([]);
  const [userResult, setUserResult] = useState<Profile[]>([]);
  const [questionResult, setQuestionResult] = useState<Question[]>([]);
  const [thingToSearch, setThingToSearch] = useState<string>('');
  const [categoryForSearch, setCategoryForSearch] = useState<string>('user');

  const serch = useCallback(async () => {
    if (thingToSearch != '') {
      try {
        const response = await api.get(`/search/do-search`, {
          params: { type: categoryForSearch, text: thingToSearch },
        });

        const data = response.data;
        console.log('respuesta del serch:', response.data);
        if (categoryForSearch == 'user') {
          setUserResult(data);
          setQuestionResult([]);
          setGroupResult([]);
        } else if (categoryForSearch == 'question') {
          setQuestionResult(data);
          setGroupResult([]);
          setUserResult([]);
        } else {
          setGroupResult(data);
          setUserResult([]);
          setQuestionResult([]);
        }
      } catch (error) {
        console.error('Error in serch:', error);
      }
    }
  }, [categoryForSearch, thingToSearch]);

  useEffect(() => {
    serch();
  }, [serch, thingToSearch]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Input
        startContent={<LuSearch className="text-foreground-700" />}
        placeholder="Buscar en ScholarSync"
        onClick={() => onOpen()}
      />

      <Modal
        size={'5xl'}
        isOpen={isOpen}
        onClose={onClose}
        className="max-h-[500px]"
        scrollBehavior={'inside'}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className=" flex flex-col gap-5  items-center justify-center">
                  <Input
                    startContent={<LuSearch className="text-foreground-700" />}
                    placeholder="Buscar en ScholarSync"
                    value={thingToSearch}
                    onValueChange={setThingToSearch}
                  />
                  <CustomTabs
                    setTabs={setCategoryForSearch}
                    selected={categoryForSearch}
                  ></CustomTabs>
                </div>
              </ModalHeader>
              <ModalBody>
                <SearchResult
                  questionResult={questionResult}
                  userResult={userResult}
                  groupResult={groupResult}
                  categoryForSearch={categoryForSearch}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
