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
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await participantService.getAllParticipants();
    res.json(requests);
  } catch (e) {
    res.status(500).json(e);
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
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await participantService.getAllPlayers();
    res.json(requests);
  } catch (e) {
    res.status(500).json(e);
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
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const requests = await participantService.getAllSpectator();
    res.json(requests);
  } catch (e) {
    res.status(500).json(e);
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
 description: 'User unautorized.'
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
        res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    if(req.session.utid != UserTypes.admin && req.session.uid != event?.creatorId){
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    await participantService.remove(req.params.userId as string, req.params.eventId as string);
    res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
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
 description: 'User unautorized.'
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
        res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    await participantService.remove(req.session.uid as string, req.params.eventId as string);
    res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
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
    if(event?.code != req.params.code){ 
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    await participantService.create(req.session.uid as string, req.params.eventId as string, "Player");
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
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
    await participantService.create(req.session.uid as string, req.params.eventId as string, "Spectator");
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
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
}