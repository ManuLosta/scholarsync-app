import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useGroups } from '../../hooks/useGroups';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  TimeInput,
} from '@nextui-org/react';
import {
  now,
  getLocalTimeZone,
  Time,
  CalendarDate,
  CalendarDateTime,
} from '@internationalized/date';
import GroupUserPicture from '../groups/GroupPicture';
import api from '../../api';
import { useAuth } from '../../hooks/useAuth';

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

export default function EventForm({ onClose }: { onClose: () => void }) {
  const { groups } = useGroups();
  const { user } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start: now(getLocalTimeZone()),
    },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
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

    api
      .post('events/create', {
        title: data.title,
        start: startTime.toDate(getLocalTimeZone()),
        end: endTime.toDate(getLocalTimeZone()),
        userId: user?.id,
        groupId: data.groupId,
      })
      .then((res) => {
        console.log(res.data);
        onClose();
      })
      .catch((err) => console.error('Error posting event: ', err));
  };

  return (
    <form className="flex gap-3 flex-col" onSubmit={handleSubmit(onSubmit)}>
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
              base: 'max-w-xs',
              trigger: 'h-14',
            }}
            onChange={onChange}
            className="mb-2"
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
                    className: 'm-2',
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
          <DatePicker
            errorMessage={errors?.date?.message}
            isInvalid={!!errors.date}
            onChange={onChange}
            label="Fecha"
            hideTimeZone={true}
          />
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
            />
          )}
        />
      </div>
      <Button color="primary" type="submit">
        Crear
      </Button>
    </form>
  );
}
