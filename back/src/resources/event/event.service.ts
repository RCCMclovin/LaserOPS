import { PrismaClient, Event } from '../../generated/prisma/client';
import { EventDTO, EventWithCreator} from './event.types';

const creatorSelect = {
    id: true,
  name: true,
};

const prisma = new PrismaClient();

async function getAllEvents(): Promise<EventWithCreator[]> {
  const events = await prisma.event.findMany({
    include: { creator: { select: creatorSelect } },
    where:{isPublished: true},
    orderBy:{date:'desc'}});
  return events;
}

async function getAllEventsFromUser(creator: string, isPublished: boolean | null): Promise<EventWithCreator[]> {
  const where = isPublished !== null
    ? { creatorId: creator, isPublished }
    : { creatorId: creator };

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { creator: { select: creatorSelect } },
  });

  return events;
}

async function create(event:EventDTO): Promise<Event> {
    const new_event = await prisma.event.create({data: event});
    return new_event;
}

async function update(id: string, event:EventDTO): Promise<Event> {
    const new_event = await prisma.event.update({where: {id}, data: event});
    return new_event;
}

async function remove(id: string): Promise<Event>{
    const old_event = await prisma.event.delete({where:{id}});
    return old_event;
}

async function read(id: string): Promise<Event | null>{
    const event = await prisma.event.findUnique({where: {id}});
    return event;
}

async function isCodeUnique(code: string):Promise<boolean>{
    const exists = !!(await prisma.event.findUnique({where:{code}}));
    return !exists;
}

export default{
    getAllEvents,
    getAllEventsFromUser,
    create,
    update,
    remove,
    read,
    isCodeUnique,
}