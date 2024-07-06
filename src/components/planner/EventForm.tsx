import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useGroups } from '../../hooks/useGroups';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  SelectItem,
  TimeInput,
} from '@nextui-org/react';
import {
  getLocalTimeZone,
  Time,
  CalendarDate,
  CalendarDateTime,
} from '@internationalized/date';
import GroupUserPicture from '../groups/GroupPicture';
import api from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { Event } from '../../types/types';
import { I18nProvider } from '@react-aria/i18n';

const formSchema = z
  .object({
    title: z.string(),
    date: z.custom<CalendarDate>((value) => value instanceof CalendarDate, {
      message: 'Valor requerido',
    }),
    start: z.custom<Time>((value) => value instanceof Time, {
      message: 'Valor requerido',
    }),
    end: z.custom<Time>((value) => value instanceof Time, {
      message: 'Valor requerido',
    }),
    groupId: z.string(),
    saveGoogle: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.date) return;

      const startDateTime = new CalendarDateTime(
        data.date.year,
        data.date.month,
        data.date.day,
        data.start.hour,
        data.start.minute,
        data.start.second,
      );

      const endDateTime = new CalendarDateTime(
        data.date.year,
        data.date.month,
        data.date.day,
        data.end.hour,
        data.end.minute,
        data.end.second,
      );

      return endDateTime.compare(startDateTime) > 0;
    },
    {
      message: 'El tiempo de fin debe ser después que el tiempo de inicio.',
      path: ['end'],
    },
  );

type InputType = z.infer<typeof formSchema>;

export default function EventForm({
  onClose,
  onCreate,
  event,
}: {
  onClose: () => void;
  onCreate: (event: Event) => void;
  event?: Event;
}) {
  const { groups } = useGroups();
  const { user } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
    defaultValues: event
      ? {
          title: event?.title,
          groupId: event?.groupId,
          date: new CalendarDate(
            event.start.getFullYear(),
            event.start.getMonth() + 1,
            event.start.getDate(),
          ),
          start: new Time(event.start.getHours(), event.start.getMinutes()),
          end: new Time(event.end.getHours(), event.start.getMinutes()),
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    console.log(data);

    const startTime = new CalendarDateTime(
      data.date.year,
      data.date.month,
      data.date.day,
      data.start.hour,
      data.start.minute,
    );
    const endTime = new CalendarDateTime(
      data.date.year,
      data.date.month,
      data.date.day,
      data.end.hour,
      data.end.minute,
    );

    if (event) {
      api
        .post('events/update', {
          id: event.id,
          title: data.title,
          start: startTime.toDate(getLocalTimeZone()),
          end: endTime.toDate(getLocalTimeZone()),
          groupId: data.groupId,
          userId: user?.id,
        })
        .then((res) => {
          const event: Event = res.data;
          onCreate(event);
          onClose();
        });
    } else {
      api
        .post('events/create', {
          title: data.title,
          start: startTime.toDate(getLocalTimeZone()),
          end: endTime.toDate(getLocalTimeZone()),
          userId: user?.id,
          groupId: data.groupId,
        })
        .then((res) => {
          const event: Event = res.data;
          onCreate(event);
          onClose();
        })
        .catch((err) => console.error('Error posting event: ', err));
    }
  };

  return (
    <form className="flex gap-3 flex-col p-3" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Título del evento"
            type="text"
            errorMessage={errors?.title?.message}
            isInvalid={!!errors.title}
          />
        )}
      />
      <Controller
        name="groupId"
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            classNames={{
              base: 'max-w-xs min-w-full',
              trigger: 'h-14',
            }}
            onChange={onChange}
            isDisabled={!!event}
            defaultSelectedKeys={event && [event?.groupId]}
            placeholder="Elige un grupo"
            labelPlacement="outside"
            errorMessage={errors?.groupId?.message}
            isInvalid={!!errors.groupId}
            aria-label="Select group"
            items={groups}
            renderValue={(items) => {
              return items.map((item) => (
                <GroupUserPicture
                  key={item.data?.id}
                  groupId={item.data?.id || ''}
                  propForUser={{
                    name: item.data?.title,
                    description: item.data?.description,

                    avatarProps: { color: 'primary' },
                    key: item.data?.id,
                  }}
                  hasPicture={item.data?.hasPicture || false}
                />
              ));
            }}
          >
            {(group) => (
              <SelectItem key={group.id} textValue={group.id}>
                <GroupUserPicture
                  key={group.id}
                  groupId={group.id}
                  hasPicture={group.hasPicture}
                  propForUser={{
                    name: group.title,
                    description: group.description,
                    avatarProps: { color: 'primary' },
                  }}
                />
              </SelectItem>
            )}
          </Select>
        )}
      />
      <Controller
        name="date"
        control={control}
        render={({ field: { onChange } }) => (
          <I18nProvider locale="es-ES">
            <DatePicker
              errorMessage={errors?.date?.message}
              isInvalid={!!errors.date}
              onChange={onChange}
              label="Fecha"
              hideTimeZone={true}
              defaultValue={
                event &&
                new CalendarDate(
                  event.start.getFullYear(),
                  event.start.getMonth() + 1,
                  event.start.getDate(),
                )
              }
            />
          </I18nProvider>
        )}
      />
      <div className="flex gap-2">
        <Controller
          name="start"
          control={control}
          render={({ field: { onChange } }) => (
            <TimeInput
              onChange={onChange}
              label="Inicio"
              errorMessage={errors?.start?.message}
              isInvalid={!!errors.start}
              hideTimeZone={true}
              granularity="minute"
              defaultValue={
                event &&
                new Time(event.start.getHours(), event.start.getMinutes())
              }
            />
          )}
        />
        <Controller
          name="end"
          control={control}
          render={({ field: { onChange } }) => (
            <TimeInput
              onChange={onChange}
              label="Fin"
              errorMessage={errors?.end?.message}
              isInvalid={!!errors.end}
              granularity="minute"
              defaultValue={
                event && new Time(event.end.getHours(), event.end.getMinutes())
              }
            />
          )}
        />
      </div>
      <Controller
        name="saveGoogle"
        control={control}
        render={({ field: { onChange } }) => (
          <Checkbox onChange={onChange}>
            Guardar en Calendario de Google
          </Checkbox>
        )}
      />
      {event ? (
        <div className="w-full flex gap-2">
          <Button
            color="danger"
            variant="flat"
            className="grow"
            onPress={onClose}
          >
            Cerrar
          </Button>
          <Button color="primary" type="submit" className="grow">
            Editar
          </Button>
        </div>
      ) : (
        <Button color="primary" type="submit">
          Crear
        </Button>
      )}
    </form>
  );
}
