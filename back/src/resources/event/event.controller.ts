import { Request, Response } from 'express';
import eventService from './event.service';
import { CreateEventDTO, EventDTO, EventPublic} from './event.types';
import {Event} from '../../generated/prisma/client';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {generateRandomString} from '../../utils/keyGen';
import { UserTypes } from '../userType/userType.consts';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Recupera dados de todos os eventos.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/EventPublic' }]
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const events = await eventService.getAllEvents();
    const eventsPublic: EventPublic[] = [];
    events.forEach((e) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {code, ...tmp} = e;
        eventsPublic.push(tmp);
    })
    res.json(eventsPublic);
  } catch (e) {
    res.status(500).json(e);
  }
};
const indexFromUser = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Recupera dados de todos os eventos de um usuário.'
 #swagger.parameters['userId'] = { description: 'ID do usuário' }
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/EventPublic' }]
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const events = await eventService.getAllEventsFromUser(req.params.userId as string);
    const eventsPublic: EventPublic[] = [];
    events.forEach((e) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {code, ...tmp} = e;
        eventsPublic.push(tmp);
    })
    res.json(eventsPublic);
  } catch (e) {
    res.status(500).json(e);
  }
};
const create = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Cria um evento.'
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/CreateEventDTO' }
 } 
 #swagger.responses[201] = {
 schema: { $ref: '#/definitions/Event' }
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/

  let code: string = generateRandomString(8);
  try{
    while(!eventService.isCodeUnique(code)){
        code = generateRandomString(8);
    }
  }catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }

  const request = {
    ...req.body as CreateEventDTO, 
    creatorId:req.session.uid, 
    code: code,
    isPublished: 'false',
    } as EventDTO;

  if(req.session.utid == UserTypes.client){
    res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
  }

  try {
    const new_event = await eventService.create(request);
    res.json(new_event);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};
const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Remove os dados de um evento.'
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.responses[204] = {
 description: "Event deleted."
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const event = await eventService.read(req.params.eventId as string);
    if(req.session.utid != UserTypes.admin && req.session.uid != event?.creatorId){
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    await eventService.remove(req.params.eventId as string);
    res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const update = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Atualiza os dados de um evento.'
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/CreateEventDTO' }
 } 
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/UserDTO' }
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um evento com o id informado.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const event = await eventService.read(req.params.eventId as string);
    if(!event){
        res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    if(req.session.utid != UserTypes.admin && req.session.uid != event?.creatorId){
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    const new_event = {
    ...req.body as CreateEventDTO, 
    creatorId:event?.creatorId, 
    code: event?.code,
    isPublished: event?.isPublished,
    } as EventDTO;

    const newEvent = await eventService.update(req.params.eventId as string, new_event);
    res.json(newEvent);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const togglePublish = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Publica/Despublica um evento.'
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/UserDTO' }
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um evento com o id informado.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const event = await eventService.read(req.params.eventId as string);
    if(!event){
        res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    if(req.session.utid != UserTypes.admin && req.session.uid != event?.creatorId){
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    const new_event = {
    date:event?.date,
    description: event?.description,
    creatorId: event?.creatorId,
    code:event?.code,
    isPublished: event?.isPublished == true? false : true,
    } as EventDTO;

    const newEvent = await eventService.update(req.params.eventId as string, new_event);
    res.json(newEvent);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const read = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Recupera dados de um evento específico.'
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/EventPublic' | $ref: '#/definitions/Event' }
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um evento com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  
  try {
    const event: Event | null = await eventService.read(req.params.eventId as string);
    if(req.session.uid == event?.creatorId){
        res.json(event);
    }else{
        if(event){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {code, ...publicEvent} = event;
            res.json(publicEvent);
        }
    }
    
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default{
    index,
    indexFromUser,
    create,
    remove,
    update,
    togglePublish,
    read,
}
