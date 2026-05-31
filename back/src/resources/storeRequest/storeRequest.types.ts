import { StoreRequest } from '../../generated/prisma/client';

export interface CreateRequestDTO{
    text: string
}

export type RequestDTO = Omit<StoreRequest, 'id' | 'createdAt'>
