import dayjs from 'dayjs';
import { Event } from '../../types/types';

export default function CustomEvent({ event }: { event: Event }) {
  return (
    <div className="bg-primary w-full h-full p-2 rounded-md flex gap-1 flex-col">
      <p className="text-xs">
        {dayjs(event.start).format('HH:mm')} -{' '}
        {dayjs(event.end).format('HH:mm')}
      </p>
      <p className="text-white font-bold flex-wrap">{event.title}</p>
      <div>
        <p className="text-white font-light text-sm">{event.groupName}</p>
      </div>
    </div>
  );
}
