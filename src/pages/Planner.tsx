import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import api from '../api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { Button } from '@nextui-org/react';

const localizer = dayjsLocalizer(dayjs);

export default function Planner() {
  const { user } = useAuth();

  useEffect(() => {
    api.get(`events?userId=${user?.id}`).then((res) => {
      console.log(res.data);
    });
  }, []);

  const handleCreate = () => {
    const data = {
      userId: user?.id,
      groupId: '52d25a0a-9903-453a-aead-fc4742b3d35f',
      title: 'Nuevo Evento',
      start: new Date(),
      end: new Date(),
    };

    api
      .post('/events/create', data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container p-8">
      <Button onPress={handleCreate}>Crear event</Button>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
      />
    </div>
  );
}
