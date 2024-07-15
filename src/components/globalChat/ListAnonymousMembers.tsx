import React, { useEffect, useRef } from 'react';
import api from '../../api';
import { Chat } from '../../types/types';

interface Props {
  getChat: Chat;
  setChat: React.Dispatch<React.SetStateAction<Chat>>;
  chatId: string;
}

const ListAnonymousMembers: React.FC<Props> = ({
  getChat,
  setChat,
  chatId,
}) => {
  const previousAnonymousMembersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchAnonymousMembers = () => {
      api
        .get(`global-chat/list-anonymous-members?chatId=${chatId}`)
        .then((res) => {
          const anonymousMembers: string[] = res.data;
          const newAnonymousMembers = anonymousMembers.filter(
            (member) => !previousAnonymousMembersRef.current.has(member),
          );

          if (newAnonymousMembers.length > 0) {
            newAnonymousMembers.forEach((member) =>
              previousAnonymousMembersRef.current.add(member),
            );
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchAnonymousMembers();
  }, [chatId, getChat, setChat]); // Dependencia solo en chatId

  return null;
};

export default ListAnonymousMembers;
