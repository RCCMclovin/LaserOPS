import { Request, Response } from 'express';
import userService from './user.service';
import { CreateUserDTO, UpdateUserDTO} from './user.types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UserTypes } from '../userType/userType.consts';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Usuários"]
 #swagger.summary = 'Recupera dados de todos os usuários.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/UserDTO' }]
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json(e);
  }
};
const create = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Usuários"]
 #swagger.summary = 'Adiciona um novo usuário na base.'
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/CreateUserDTO' }
 } 
 #swagger.responses[201] = {
 schema: { $ref: '#/definitions/UserDTO' }
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[409] = {
 description:  'Já existe um usuário com o id informado.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const user = req.body as CreateUserDTO;
  try {
    const findByEmail = await userService.findUserByEmail(user.email);
    if (!findByEmail) {
      const newUser = await userService.createUser(user);
      res.json(newUser);
    } else {
      res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
    }
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};
const update = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Usuários"]
 #swagger.summary = 'Atualiza os dados de um usuário específico.'
 #swagger.parameters['userId'] = { description: 'ID do usuário' }
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/CreateUserDTO' }
 } 
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/UserDTO' }
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um usuário com o id informado.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const user = req.body as UpdateUserDTO;
    if (await userService.readUser(req.params.userId as string)) {
      const newUser = await userService.updateUser(req.params.userId as string, user);
      res.json(newUser);
    } else {
      res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Usuários"]
 #swagger.summary = 'Remove os dados de um usuário específico.'
 #swagger.parameters['userId'] = { description: 'ID do usuário' }
 #swagger.responses[204] = {
 description: "User deleted."
 }
 #swagger.responses[401] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    await userService.removeUser(req.params.userId as string);
    res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
const read = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Usuários"]
 #swagger.summary = 'Recupera dados de um usuário específico.'
 #swagger.parameters['userId'] = { description: 'ID do usuário' }
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/UserDTO' }
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const user = await userService.readUser(req.params.userId as string);
    res.json(user);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const checkEmail = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Usuários"]
 #swagger.summary = 'Verifica se um email já está cadastrado.'
 #swagger.parameters['email'] = { description: 'Email a ser verificado' }
 #swagger.responses[200] = {
 type: 'boolean',
 description: 'true se o email já está cadastrado, false caso contrário'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const email = req.params.email as string;
    const user = await userService.checkEmail(email);
    res.json(user);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const checkRole = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Usuários"]
 #swagger.summary = 'Retorna o nome e tipo do usuário logado.'
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/UserRoleDTO' }
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const user = await userService.readUser(req.session.uid as string);
    if(user.userTypeId == UserTypes.admin){
        res.json({name:user.name, role: "admin"});
    }
    if(user.userTypeId == UserTypes.client){
        res.json({name:user.name, role: "client"});
    }
    if(user.userTypeId == UserTypes.store){
        res.json({name:user.name, role: "store"});
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default {
  index,
  create,
  update,
  remove,
  read,
  checkEmail,
  checkRole,
};