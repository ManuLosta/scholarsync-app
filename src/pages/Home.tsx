import PostList from '../components/feed/PostList.tsx';
import { LuCalendar, LuStar } from 'react-icons/lu';
import { OrderType } from '../context/feedReducer.ts';
import { useAuth } from '../hooks/useAuth.ts';
import CreateGlobalChatButton from '../components/globalChat/CreateGlobalChatButton.tsx';

const postsOrder = [
  {
    key: 'score-user',
    name: 'Relevancia',
    icon: <LuStar />,
  },
  {
    key: 'date-user',
    name: 'Fecha de Carga',
    icon: <LuCalendar />,
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container p-8">
      <CreateGlobalChatButton></CreateGlobalChatButton>
      <PostList
        orders={postsOrder}
        defaultOrder={postsOrder[0].key as OrderType}
        queryId={user?.id || ''}
      />
    </div>
  );
}
