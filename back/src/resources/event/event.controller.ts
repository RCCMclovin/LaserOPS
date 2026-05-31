import { Request, Response } from 'express';
import eventService from './event.service';
import { CreateEventDTO, EventDTO, EventPublic, EventWithCreator} from './event.types';
import {Event} from '../../generated/prisma/client';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {generateRandomString} from '../../utils/keyGen';
import { UserTypes } from '../userType/userType.consts';

function toPublicEvent(event: Event | EventWithCreator): EventPublic {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { code, ...publicEvent } = event;
  return publicEvent;
}

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Recupera dados de todos os eventos.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/EventPublic' }]
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const events = await eventService.getAllEvents();      
      return res.json(events.map(toPublicEvent));
  } catch (e) {
    return res.status(500).json(e);
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
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const isOwnerOrAdmin =
      req.session.uid && (req.session.uid === req.params.userId ||
      req.session.utid === UserTypes.admin);

    const events = await eventService.getAllEventsFromUser(
      req.params.userId as string,
      isOwnerOrAdmin ? null : true,
    );

    return res.json(isOwnerOrAdmin ? events : events.map(toPublicEvent));
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
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
 description: 'User unauthenticated.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/

  if(req.session.utid == UserTypes.client){
    return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
  }

  let code: string = generateRandomString(8);
  try{
    while(!(await eventService.isCodeUnique(code))){
        code = generateRandomString(8);
    }
  }catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
  const body = req.body as CreateEventDTO;

  const request = {
    date: new Date(body.date),
    description: body.description,
    creatorId:req.session.uid, 
    code: code,
    isPublished: false,
    } as EventDTO;
  try {
    const new_event = await eventService.create(request);
    return res.json(new_event);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
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
 description: 'User unauthenticated.'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const event = await eventService.read(req.params.eventId as string);

    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    if (req.session.utid !== UserTypes.admin && req.session.uid !== event.creatorId) {
      return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
    }

    await eventService.remove(req.params.eventId as string);
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
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
 schema: { $ref: '#/definitions/Event' }
 }
 #swagger.responses[403] = {
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

    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    if (req.session.utid !== UserTypes.admin && req.session.uid !== event.creatorId) {
      return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
    }

    const body = req.body as EventDTO;

    const new_event = {
      date: new Date(body.date),
      description: body.description,
      creatorId: event.creatorId,
      code: event.code,
      isPublished: event.isPublished,
    } as EventDTO;

    const newEvent = await eventService.update(req.params.eventId as string, new_event);
    return res.json(newEvent);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const togglePublish = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Eventos"]
 #swagger.summary = 'Publica/Despublica um evento.'
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/Event' }
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[403] = {
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
    const event: Event | null = await eventService.read(req.params.eventId as string);
    if(!event){
      return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    if(req.session.utid != UserTypes.admin && req.session.uid != event?.creatorId){
     return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
    }
    const new_event = {
    date:event?.date,
    description: event?.description,
    creatorId: event?.creatorId,
    code:event?.code,
    isPublished: event?.isPublished == true? false : true,
    } as EventDTO;

    const newEvent = await eventService.update(req.params.eventId as string, new_event);
    return res.json(newEvent);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
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
 description: 'User unauthenticated.'
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
    if(event && req.session.uid == event?.creatorId){
        return res.json(event);
    }else{
        if(event){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {code, ...publicEvent} = event;
            return res.json(publicEvent);
        }else{
          return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
        }
    }
    
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
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
