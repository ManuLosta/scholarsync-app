import { useEffect, useState } from 'react';

import api from '../api.ts';
import { Button, CircularProgress } from '@nextui-org/react';

import { useNotifications } from './../hooks/useNotifications.ts';


export default function FriendStatusButton({
  userId,
  myId,
}: {
  userId: string | undefined;
  myId: string | undefined;
}) {
  const notifications = useNotifications();
  const [loading, setLoading] = useState(true);
  const [requestState, setRequestState] = useState<string>('');
  const [notificationId, setNotificationId] = useState('');

  const handleChange = (action: (notificationId: string) => void) => {
    action(notificationId);
  };

  function buttonEngine(acept?: boolean) {
    switch (requestState) {
      case 'friend-request/not-sent':
        sendFriendRequest();
        break;
      case 'friend-request/already-friends':
        // Eliminar amigo Implementar en el futuro
        break;
      case 'friend-request/sent':
        // Pendiente, no hace nada,
        // Quizas en el futuro, eliminar solicitud
        break;
      case 'friend-request/received':
        if (acept) {
          aceptFriendRequest();
        } else {
          rejectFriendRequest();
        }
        setRequestState('friend-request/not-sent');
        break;
    }
    setTimeout(() => {
      makerequesState();
    }, 400);
  }

  function getButtonText(id: string): string {
    switch (id) {
      case 'friend-request/sent':
        return 'Pendiente';
      case 'friend-request/received':
        return 'Aceptar solicitud';
      case 'friend-request/already-friends':
        return 'Quitar amigo';
      default:
        return 'Agregar amigo';
    }
  }

  function sendFriendRequest() {
    const data = {
      from_id: myId,
      to_id: userId,
    };

    api
      .post('friend-requests/send-friend-request', data)
      .then(() => {
        setRequestState('friend-request/sent');
      })
      .catch((err) => console.error(err));
  }

  function aceptFriendRequest() {
    handleChange(notifications.acceptFriendRequest);
    setRequestState('friend-request/already-friends');
  }

  function rejectFriendRequest() {
    handleChange(notifications.rejectFriendRequest);
  }

  function makerequesState() {
    // Estados:
    // Son amigos
    // El me envio una request a mi
    // la request esta pendiente
    // no son amigos

    if (myId == undefined || userId == undefined) {
      return;
    } else {
      const data = {
        from_id: myId,
        to_id: userId,
      };
      console.log(data);
      api
        .post('friend-requests/get-request-status', data)
        .then((res) => {
          setRequestState(res.data.status);
          if (res.data.status == 'friend-request/received') {
            setNotificationId(res.data.notification_id);
          }
        })
        .catch((err) => console.error(err));
    }
    console.log(requestState);
  }

  useEffect(() => {
    makerequesState();
    setLoading(false);
  }, [myId, userId]);

  return loading ? (
    <CircularProgress />
  ) : (
    <div>
      <Button onClick={() => buttonEngine(true)} color="primary">
        {getButtonText(requestState)}
      </Button>
      {requestState === 'friend-request/received' ? (
        <Button
          color="danger"
          onClick={() => buttonEngine(false)}
          className="ml-5"
        >
          {' '}
          Rechazar solicitud
        </Button>
      ) : null}
    </div>
  );
}
