import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import api from '../api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import CreateEvent from '../components/planner/CreateEvent.tsx';

const localizer = dayjsLocalizer(dayjs);

export default function Planner() {
  const { user } = useAuth();
  const [events, setEvents] = useState();

  useEffect(() => {
    api
      .get(`events?userId=${user?.id}`)
      .then((res) => {
        const data = res.data;
        const newEvents = data.map((event) => {
          const startDate = new Date(event.start);
          const endDate = new Date(event.end);

          const localStartDate = new Date(
            startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000,
          );
          const localEndDate = new Date(
            endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000,
          );

          return {
            title: event.title,
            start: localStartDate,
            end: localEndDate,
          };
        });
        console.log(newEvents);
        setEvents(newEvents);
      })
      .catch((err) => console.error('Error fetching events: ', err));
  }, []);

  const onSelectSlot = useCallback((range) => {
    console.log(range);
  }, []);

  return (
    <div className="container p-8">
      <CreateEvent />
      <Calendar
        events={events}
        defaultView={Views.WEEK}
        onSelectSlot={onSelectSlot}
        localizer={localizer}
        style={{ height: 700 }}
        selectable
      />
    </div>
  );
}
