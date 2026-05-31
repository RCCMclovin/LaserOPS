import {Event} from '../../generated/prisma/client';

export type CreateEventDTO = Pick<Event, 'date' | 'description'>

export type EventDTO = Pick<Event, 'date' | 'creatorId' | 'description' | 'code'>

export type EventPublic = Omit<Event, 'code'>