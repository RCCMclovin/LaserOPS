import { PrismaClient, StoreRequest } from '../../generated/prisma/client';
import { RequestDTO } from './storeRequest.types';

const prisma = new PrismaClient();

async function getAllRequests(): Promise<StoreRequest[]> {
  const requests = await prisma.storeRequest.findMany();
  return requests;
}

async function getAllRequestsFromUser(userId: string): Promise<StoreRequest[]> {
  const requests = await prisma.storeRequest.findMany({ where: { userId } });
  return requests;
}

async function create(request: RequestDTO): Promise<StoreRequest> {
    const new_request = await prisma.storeRequest.create({data:request});
    return new_request;
}

async function remove(id: string): Promise<StoreRequest>{
    const request = await prisma.storeRequest.delete({where:{id}});
    return request;
}

async function update(id: string, data: RequestDTO): Promise<StoreRequest>{
    const request = await prisma.storeRequest.update({where:{id}, data:data});
    return request;
}

async function findRequest(id: string): Promise<StoreRequest | null>{
    const request = await prisma.storeRequest.findFirst({where:{id}});
    return request;    
}

export default {
    getAllRequests,
    getAllRequestsFromUser,
    create,
    remove,
    update,
    findRequest,
}