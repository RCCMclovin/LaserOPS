import { StoreRequest } from '../../generated/prisma/client';

export interface CreateRequestDTO{
    text: string
}

export type RequestDTO = Omit<StoreRequest, 'id' | 'createdAt'>

export type RequestWithUser = StoreRequest & {user: {
    id: string;
    name: string;
    email: string;
}}
