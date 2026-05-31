import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import participantService from './participant.service';
import eventService from '../event/event.service';
import { UserTypes } from '../userType/userType.consts';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Participante"]
 #swagger.summary = 'Recupera dados de todos os participantes de uma partida.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/Participant' }]
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await participantService.getAllParticipants();
    return res.json(requests);
  } catch (e) {
    return res.status(500).json(e);
  }
};
const players = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Participante"]
 #swagger.summary = 'Recupera dados de todos os jogadores de uma partida.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/Participant' }]
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await participantService.getAllPlayers();
    return res.json(requests);
  } catch (e) {
    return res.status(500).json(e);
  }
};
const spectators = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Participante"]
 #swagger.summary = 'Recupera dados de todos os espectadores de uma partida.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/Participant' }]
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await participantService.getAllSpectator();
    return res.json(requests);
  } catch (e) {
    return res.status(500).json(e);
  }
};
const removeById = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Participante"]
 #swagger.summary = 'Remove os dados de um participante específico.'
 #swagger.parameters['userId'] = { description: 'ID do usuário' }
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.responses[204] = {
 description: "User deleted."
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um evento com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const event = await eventService.read(req.params.eventId as string);
    if(!event){
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    if(req.session.utid != UserTypes.admin && req.session.uid != event?.creatorId){
        return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    await participantService.remove(req.params.userId as string, req.params.eventId as string);
    return res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Participante"]
 #swagger.summary = 'O participante se desinscreve.'
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.responses[204] = {
 description: "User deleted."
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um evento com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const event = await eventService.read(req.params.eventId as string);
    if(!event){
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    await participantService.remove(req.session.uid as string, req.params.eventId as string);
    return res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const createAsPlayer = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Participante"]
 #swagger.summary = 'Participante se inscreve como jogador.'
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.parameters['code'] = { description: 'Código do evento' }
 #swagger.responses[200] = {
 description: 'User now participates in event.'
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um evento com o id informado.'
 }
 #swagger.responses[409] = {
 description:  'Usuário já é participante.'
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
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    if(event?.code != req.params.code){ 
        return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    const isParticipant: boolean = !!(await participantService.read(req.session.uid as string, event.id));
    if(isParticipant){
      return res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
    } 
    await participantService.create(req.session.uid as string, req.params.eventId as string, "Player");
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const createAsSpectator = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Participante"]
 #swagger.summary = 'Participante se inscreve como espectador.'
 #swagger.parameters['eventId'] = { description: 'ID do evento' }
 #swagger.responses[200] = {
 description: 'User now participates in event.'
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um evento com o id informado.'
 }
 #swagger.responses[409] = {
 description:  'Usuário já é participante.'
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
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    const isParticipant: boolean = !!(await participantService.read(req.session.uid as string, event.id));
    if(isParticipant){
      return res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
    } 
    await participantService.create(req.session.uid as string, req.params.eventId as string, "Spectator");
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const mine = async (req: Request, res: Response) => {
    /*
 #swagger.tags = ["Participante"]
 #swagger.summary = 'Retorna todas as participações do usuário.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/Participant' }]
 }
 #swagger.responses[401] = {
 description: 'User unauthenticated.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const participants = await participantService.getParticipantsFromUser(req.session.uid as string);
    return res.json(participants);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default{
    index,
    players,
    spectators,
    removeById,
    remove,
    createAsPlayer,
    createAsSpectator,
    mine,
}