import { PrismaClient, Event } from '../../generated/prisma/client';
import { EventDTO} from './event.types';

const prisma = new PrismaClient();

async function getAllEvents(): Promise<Event[]> {
  const events = await prisma.event.findMany({where:{isPublished: true}, orderBy:{date:'desc'}});
  return events;
}

async function getAllEventsFromUser(creator: string, isPublished: boolean | null): Promise<Event[]> {
  if(isPublished){
    const events = await prisma.event.findMany({where: {creatorId:creator, isPublished: isPublished },orderBy:{date:'desc'}});
    return events;
  }else{
    const events = await prisma.event.findMany({where: {creatorId:creator},orderBy:{date:'desc'}});
    return events;
  }
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