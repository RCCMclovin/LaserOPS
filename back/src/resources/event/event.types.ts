import {Event} from '../../generated/prisma/client';

export type CreateEventDTO = Pick<Event, 'date' | 'description'>

export type EventDTO = Pick<Event, 'date' | 'creatorId' | 'description' | 'code' | 'isPublished'>

export type EventPublic = Omit<Event, 'code'>

export type EventWithCreator = Event & {
  creator?: {
    id: string;
    name: string;
  };
};