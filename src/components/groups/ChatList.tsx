import { Chat, Profile } from '../../types/types';
import { Avatar, AvatarGroup, ScrollShadow } from '@nextui-org/react';
import api from '../../api.ts';

export default function ChatList({ chats }: { chats: Chat[] }) {
  const fetchImage = (user: Profile): string => {
    if (!user.hasPicture) return '';
    // fetch image from server
    api
      .get(`/users/get-profile-picture?user_id=${user.id}`)
      .then((res) => {
        const data = res.data;
        const base64 = data.base64Encoding;
        const fileType = data.file.fileType;
        const imageSrc = `data:${fileType};base64,${base64}`;
        return imageSrc;
      })
      .catch((err) => console.error('Error fetching profile picture:', err));
  };

  return (
    <div className="my-4">
      <h2 className="font-bold text-lg mb-2">Sesiones de estudio</h2>
      <ScrollShadow
        className="flex gap-2 w-[100%] overflow-x-auto"
        hideScrollBar
        orientation="horizontal"
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="min-w-[200px] gap-3 p-4 rounded-lg bg-danger-100 flex flex-col"
          >
            <p className="font-bold text-xl">{chat.name}</p>
            <AvatarGroup max={5} total={chat.members.length - 3}>
              {chat.members.slice(0, 3).map((member) => (
                <Avatar name={member.firstName} src={fetchImage(member)} />
              ))}
            </AvatarGroup>
            <p>{chat.members.length}</p>
          </div>
        ))}
      </ScrollShadow>
    </div>
  );
}
