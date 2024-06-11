import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import api from '../api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import CreateEvent from '../components/planner/CreateEvent.tsx';
import { Event } from '../types/types';
import EventInfo from '../components/planner/EventInfo.tsx';

const localizer = dayjsLocalizer(dayjs);

export default function Planner() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [focusedEvent, setFocusedEvent] = useState<Event | undefined>();

  const toLocalTime = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  };

  useEffect(() => {
    api
      .get(`events?userId=${user?.id}`)
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

  const onSelectSlot = useCallback((range) => {
    console.log(range);
  }, []);

  const onSelectEvent = useCallback((event: Event) => {
    setFocusedEvent(event);
  }, []);

  const onNewEvent = (event: Event) => {
    setEvents([
      ...events,
      {
        ...event,
        start: toLocalTime(new Date(event.start)),
        end: toLocalTime(new Date(event.end)),
      },
    ]);
  };

  const onDelete = (event: Event) => {
    setEvents(events.filter((other) => other.id != event.id));
  };

  const onEdit = (event: Event) => {
    const eventIndex = events.findIndex((other) => event.id == other.id);
    if (eventIndex != -1) {
      const newEvents = [...events];
      newEvents[eventIndex] = {
        ...event,
        id: event.id,
        start: toLocalTime(new Date(event.start)),
        end: toLocalTime(new Date(event.end)),
      };
      setEvents(newEvents);
    }
  };

  return (
    <div className="container p-8">
      <CreateEvent onCreate={onNewEvent} />
      <EventInfo
        event={focusedEvent}
        isOpen={!!focusedEvent}
        onClose={() => setFocusedEvent(undefined)}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      <Calendar
        events={events}
        defaultView={Views.WEEK}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        localizer={localizer}
        style={{ height: 700 }}
        selectable
      />
    </div>
  );
}
