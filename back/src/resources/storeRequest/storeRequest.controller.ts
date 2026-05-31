import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import storeRequestService from './storeRequest.service';
import { CreateRequestDTO, RequestDTO } from './storeRequest.types';
import { UserTypes } from '../userType/userType.consts';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["StoreRequests"]
 #swagger.summary = 'Recupera dados de todos os pedidos para ser logista.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/StoreRequest' }]
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await storeRequestService.getAllRequests();
    res.json(requests);
  } catch (e) {
    res.status(500).json(e);
  }
};
const indexFromUser = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["StoreRequests"]
 #swagger.summary = 'Recupera dados de todos os pedidos de um usuário para ser logista.'
 #swagger.parameters['userId'] = { description: 'ID do usuário' }
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/StoreRequest' }]
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await storeRequestService.getAllRequestsFromUser(req.params.userId as string);
    res.json(requests);
  } catch (e) {
    res.status(500).json(e);
  }
};
const create = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["StoreRequests"]
 #swagger.summary = 'Faz um pedido para ser logista.'
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/CreateRequestDTO' }
 } 
 #swagger.responses[201] = {
 schema: { $ref: '#/definitions/StoreRequest' }
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[409] = {
 description:  'Já existe um pedido pendente para este usuário.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const request = {
    ...req.body as CreateRequestDTO, 
    userId:req.session.uid, 
    status:'Pending'
    } as RequestDTO;

  if(req.session.utid != UserTypes.client){
    res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
  }

  try {
    const requests = await storeRequestService.getAllRequestsFromUser(request.userId);
    const hasPending = !!(requests.filter((r) => r.status == "Pending"));
    if (!hasPending) {
      const new_request = await storeRequestService.create(request);
      res.json(new_request);
    } else {
      res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
    }
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};
const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["StoreRequests"]
 #swagger.summary = 'Remove os dados de um pedido para ser logista.'
 #swagger.parameters['requestId'] = { description: 'ID do pedido' }
 #swagger.responses[204] = {
 description: "Request deleted."
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const request = await storeRequestService.findRequest(req.params.requestId as string);
    if(req.session.utid != UserTypes.admin || req.session.uid != request?.userId){
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    await storeRequestService.remove(req.params.requestId as string);
    res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const read = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["StoreRequests"]
 #swagger.summary = 'Recupera dados de um pedido específico.'
 #swagger.parameters['requestId'] = { description: 'ID do pedido' }
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/StoreRequest' }
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  
  try {
    const request = await storeRequestService.findRequest(req.params.requestId as string);
    if(req.session.utid != UserTypes.admin || req.session.uid != request?.userId){
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    res.json(request);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default {
    index,
    indexFromUser,
    create,
    remove,
    read,
}