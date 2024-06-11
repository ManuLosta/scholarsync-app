import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import { Event } from '../../types/types';
import EventInfo from './EventInfo';
import dayjs from 'dayjs';

const localizer = dayjsLocalizer(dayjs);

export default function UserPlanner({ userId }: { userId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [focusedEvent, setFocusedEvent] = useState<Event | undefined>();
  const toLocalTime = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  };

  useEffect(() => {
    api
      .get(`events?userId=${userId}`)
      .then((res) => {
        const data: Event[] = res.data;
        setEvents(
          data.map((event) => ({
            ...event,
            start: toLocalTime(new Date(event.start)),
            end: toLocalTime(new Date(event.end)),
          })),
        );
      })
      .catch((err) => console.error('Error fetching events: ', err));
  }, []);

  const onSelectEvent = useCallback((event: Event) => {
    setFocusedEvent(event);
  }, []);

  return (
    <div className="mb-10">
      <h1 className="font-bold text-2xl mb-3">Planner</h1>
      <EventInfo
        event={focusedEvent}
        isOpen={!!focusedEvent}
        onClose={() => setFocusedEvent(undefined)}
        onDelete={() => {}}
        onEdit={() => {}}
        isOwner={false}
      />
      <Calendar
        events={events}
        defaultView={Views.WEEK}
        onSelectEvent={onSelectEvent}
        localizer={localizer}
        style={{ height: 700 }}
        selectable
      />
    </div>
  );
}
