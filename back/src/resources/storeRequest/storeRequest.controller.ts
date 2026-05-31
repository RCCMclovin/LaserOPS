import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import storeRequestService from './storeRequest.service';
import { CreateRequestDTO, RequestDTO } from './storeRequest.types';
import { UserTypes } from '../userType/userType.consts';
import userService from '../user/user.service';
import { UpdateUserDTO } from '../user/user.types';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["StoreRequests"]
 #swagger.summary = 'Recupera dados de todos os pedidos para ser logista.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/StoreRequest' }]
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await storeRequestService.getAllRequests();
    return res.json(requests);
  } catch (e) {
    return res.status(500).json(e);
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
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await storeRequestService.getAllRequestsFromUser(req.params.userId as string);
    return res.json(requests);
  } catch (e) {
    return res.status(500).json(e);
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
 #swagger.responses[403] = {
 description: 'User can't become store.'
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
    return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
  }

  try {
    const requests = await storeRequestService.getAllRequestsFromUser(request.userId);
    const hasNotPending: boolean = requests.some((r) => r.status == "Pending");
    if (hasNotPending) {
      const new_request = await storeRequestService.create(request);
      return res.json(new_request);
    } else {
      return res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
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
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const request = await storeRequestService.findRequest(req.params.requestId as string);
    if(req.session.utid != UserTypes.admin && req.session.uid != request?.userId){
        return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
    }
    await storeRequestService.remove(req.params.requestId as string);
    return res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
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
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[404] = {
 description: 'Request not found.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  
  try {
    const request = await storeRequestService.findRequest(req.params.requestId as string);
    if(!request){
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
    if(req.session.utid != UserTypes.admin && req.session.uid != request?.userId){
        return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
    }
    return res.json(request);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const acceptRequest = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["StoreRequests"]
 #swagger.summary = 'Aceita um pedido específico.'
 #swagger.parameters['requestId'] = { description: 'ID do pedido' }
 #swagger.responses[200] = {
 description: "Update Successful"
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[404] = {
 description: 'User or request not found.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const request = await storeRequestService.findRequest(req.params.requestId as string);
    if(!request){
      return res.sendStatus(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }else{
      if(req.session.utid != UserTypes.admin){
        return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
      }
      request.status = "Accepted";
      const user = await userService.readUser(request.userId);
      if(!user){
        return res.sendStatus(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      }else{
        const new_info: UpdateUserDTO = {name: user.name, email:user.email, userTypeId: UserTypes.store};
        await userService.updateUser(user.id, new_info);
        const new_request: RequestDTO = {text: request.text, userId: request.userId, status:request.status};
        await storeRequestService.update(request.id, new_request);
        return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
      }
    }
    
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
}
const refuseRequest = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["StoreRequests"]
 #swagger.summary = 'Recusa um pedido específico.'
 #swagger.parameters['requestId'] = { description: 'ID do pedido' }
 #swagger.responses[200] = {
 description: "Update Successful"
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[404] = {
 description: 'User or request not found.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const request = await storeRequestService.findRequest(req.params.requestId as string);
    if(!request){
      return res.sendStatus(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }else{
      if(req.session.utid != UserTypes.admin){
        return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
      }
      request.status = "Refused";
      const new_request: RequestDTO = {text: request.text, userId: request.userId, status:request.status};
      await storeRequestService.update(request.id, new_request);
      return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
}

export default {
    index,
    indexFromUser,
    create,
    remove,
    read,
    acceptRequest,
    refuseRequest,
}