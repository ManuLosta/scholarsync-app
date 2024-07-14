import axios from 'axios';
import { Event } from '../types/types';

export const saveEvent = (token: string, event: Event) => {
  axios
    .post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        id: event.id.replace(/-/gi, ''),
        summary: event.title,
        description: 'Evento creado por ScholarSync',
        start: {
          dateTime: event.start,
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.end,
          timeZone: 'UTC',
        },
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
};

export const updateEvent = (token: string, event: Event) => {
  axios
    .put(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id.replace(/-/gi, '')}`,
      {
        summary: event.title,
        description: 'Evento creado por ScholarSync',
        start: {
          dateTime: event.start,
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.end,
          timeZone: 'UTC',
        },
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
};

export const deleteEvent = (token: string, eventId: string) => {
  axios
    .delete(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId.replace(/-/gi, '')}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )
    .catch((err) => console.error(err));
};
