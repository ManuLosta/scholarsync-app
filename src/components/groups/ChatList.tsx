import { useEffect, useState } from 'react';
import { Chat } from '../../types/types';
import { Avatar, AvatarGroup, ScrollShadow } from '@nextui-org/react';
import api from '../../api.ts';
import { Link } from 'react-router-dom';

export default function ChatList({ chats }: { chats: Chat[] }) {
  const [images, setImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      const newImages: { [key: string]: string } = {};

      for (const chat of chats) {
        for (const member of chat.members) {
          if (member.hasPicture && !newImages[member.id]) {
            try {
              const res = await api.get(
                `/users/get-profile-picture?user_id=${member.id}`,
              );
              const data = res.data;
              const base64 = data.base64Encoding;
              const fileType = data.file.fileType;
              newImages[member.id] = `data:${fileType};base64,${base64}`;
            } catch (err) {
              console.error('Error fetching profile picture:', err);
            }
          }
        }
      }

      setImages(newImages);
    };

    fetchImages();
  }, [chats]);

  return (
    <div className="my-4">
      <h2 className="font-bold text-lg mb-2">Sesiones de estudio</h2>
      <ScrollShadow
        className="flex gap-4 w-[100%] overflow-x-auto"
        hideScrollBar
        orientation="horizontal"
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="min-w-[200px] gap-3 p-4 rounded-2xl bg-foreground-200 flex flex-col items-start justify-between"
          >
            <p className="font-bold text-xl">{chat.name}</p>
            <AvatarGroup max={5} total={chat.members.length - 3} isBordered>
              {chat.members.length == 0 && (
                <p className="font-light">Únete primero</p>
              )}
              {chat.members.slice(0, 3).map((member) => (
                <Avatar
                  isFocusable={false}
                  key={member.id}
                  name={member.firstName}
                  src={images[member.id]}
                />
              ))}
            </AvatarGroup>
            <Link
              to={`/chat/${chat.id}`}
              className="py-2 px-3 font-bold bg-primary rounded-xl text-white"
            >
              Unirse
            </Link>
          </div>
        ))}
      </ScrollShadow>
    </div>
  );
}
