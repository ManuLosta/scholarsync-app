import { IoIosArrowForward } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import NotificationItem from './NotificationItem.tsx';


type Notification = {
  from: string;
  to: string;
  id: string;
  created_at: string;
};
export default function NotificationPanel({isOpen, handleOpen}: {isOpen: boolean, handleOpen: () => void}){
  const [notifications, setNotifications] = useState<Notification[]>([]);




  const { user } = useAuth();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/users/${user?.id}/friend-requests`);

        if (res.ok) {
          const data = await res.json();
          const notifications : Array<Notification> = data.map((notification: Notification) => ({
            from: notification.from,
            to: notification.to,
            id: notification.id,
            created_at: notification.created_at
          }));
          setNotifications(notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }

    fetchNotifications();
  }, [user?.id]);
  return (
    isOpen ?
      <div
        className={'transition min-w-[512px] duration-1000 right-0 border-opacity-10 border-black border-2 rounded-l-xl absolute flex flex-row  h-full drop-shadow-2xl   bg-foreground-50 z-10 pt-5 pr-5 pb-5 pl-0'}>
        <IoIosArrowForward size={40} onClick={handleOpen} className={"transition delay-150 duration-[5000ms] cursor-pointer relative top-1/2 h-min w-min -left-5 rounded-full bg-white border-black border-opacity-20 border-2"}/>
        <section className="m-0 flex-col gap-0 items-start absolute right-0 w-full justify-center">
          <h2 className="pl-10 text text-2xl font-semibold font-lato">Notificaciones</h2>
          <div className="border-b-1.5 border-opacity-30 border-black flex mt-10 gap-0 flex-col items-start justify-center">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} from={notification.from} created_at={notification.created_at} isLast={notifications.indexOf(notification,0) === 0}/>
            ))}
          </div>
        </section>
      </div>
      :
      <div
        className={'translate-x-full min-w-[512px] duration-500 right-0 border-opacity-10 border-black border-2 rounded-l-xl absolute flex flex-row  h-full drop-shadow-2xl   bg-foreground-50 z-10 pt-5 pr-5 pb-5 pl-0'}>
        <IoIosArrowForward size={40}
                           className={"transition rotate-[540deg] translate-x-5 duration-1000 relative top-1/2 h-min w-min -left-5 rounded-full bg-white border-black border-opacity-20 border-2"} />
        <section className="absolute right-0 m-0 flex-col gap-3 items-start w-full justify-center">
          <h2 className="pl-10 text text-2xl font-semibold font-lato">Notificaciones</h2>
          <div className="border-b-1.5 border-opacity-30 border-black flex mt-10 gap-0 flex-col items-start justify-center">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} from={notification.from} created_at={notification.created_at} isLast={notifications.indexOf(notification,0) === 0}/>
            ))}
          </div>
        </section>
      </div>
  );
}