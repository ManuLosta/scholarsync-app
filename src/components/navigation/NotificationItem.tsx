export default function NotificationItem({
  from,
  created_at,
  isLast,
}: {
  from: string;
  created_at: string;
  isLast: boolean;
}) {
  const date: Date = new Date(created_at);
  const day =
    date.getDate().toString() +
    '/' +
    date.getMonth().toString() +
    '/' +
    date.getFullYear().toString();
  return isLast ? (
    <div
      className={`border-y-1.5 w-full border-collapse border-opacity-30 bg-white border-black p-4 `}
    >
      <p>
        {' '}
        Recibiste una solicitud de amistad de {from} el {day}
      </p>
    </div>
  ) : (
    <div
      className={
        'border-none w-full border-collapse border-opacity-30 bg-white border-black p-4 '
      }
    >
      <p>
        {' '}
        Recibiste una solicitud de amista de {from} el {day}
      </p>
    </div>
  );
}
