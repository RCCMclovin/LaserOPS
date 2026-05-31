import { PrismaClient, Participant } from '../../generated/prisma/client';

const prisma = new PrismaClient();

async function getAllParticipants(): Promise<Participant[]> {
  const participants = await prisma.participant.findMany();
  return participants;
}
async function getAllPlayers(): Promise<Participant[]>{
  const participants = await prisma.participant.findMany({where:{role:"player"}});
  return participants;
}
async function getAllExpectator(): Promise<Participant[]>{
  const participants = await prisma.participant.findMany({where:{role:"expectator"}});
  return participants;
}
async function remove(userId:string, eventId: string): Promise<Participant> {
    const participant = await prisma.participant.delete({where:{userId_eventId:{userId, eventId}}});
    return participant;
}
async function create(userId:string, eventId: string, role:string): Promise<Participant> {
    const participant = await prisma.participant.create({data:{userId, eventId, role}});
    return participant;
}

export default{
    getAllParticipants,
    getAllPlayers,
    getAllExpectator,
    remove,
    create,
}
