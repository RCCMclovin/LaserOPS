import { Request, Response } from 'express';
import { AuthDTO, SignUpDto } from './auth.types';
import { CreateUserDTO } from '../user/user.types';
import authService from './auth.service';
import userService from '../user/user.service';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UserTypes } from '../userType/userType.consts';

const login = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Auth"]
 #swagger.summary = 'Usuário faz Login.'
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/AuthDTO' }
 } 
#swagger.responses[200] = {
schema: { $ref: '#/definitions/Auth' }
}
 #swagger.responses[401] = {
 description:  'Usuário ou senha incorretos.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
 const credentials = req.body as AuthDTO;
 const data = await authService.checkAuth(credentials);

 if (data) {
   req.session.uid = data.uid;
   req.session.utid = data.utid;

   req.session.save((err) => {
     if (err) {
       console.error('Erro ao salvar a sessão:', err);
       return res
         .status(StatusCodes.INTERNAL_SERVER_ERROR)
         .send('Erro ao salvar sessão');
     }

     return res.status(StatusCodes.OK).send({
       "msg": "Usuário autenticado"
     });
   });
 } else {
   return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
 }
};

const logout = (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Auth"]
 #swagger.summary = 'Usuário faz Logout.'
 #swagger.responses[200] = {description: 'OK'}
 #swagger.responses[401] = {
 description:  'Usuário não logado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
  */
  if (!req.session.uid)
    return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
  else {
    req.session.destroy((err) => {
      if (err)
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    });
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }
};

///*

const signUp = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Auth"]
 #swagger.summary = 'Usuário é criado e faz Login.'
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/SignUpDto' }
 } 
#swagger.responses[201] = {
 schema: { $ref: '#/definitions/UserDTO' }
 }
 #swagger.responses[400] = {
 description:  'Email informado já está sendo usado.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const usuario = {...req.body as SignUpDto, userTypeId:UserTypes.client} as CreateUserDTO;
  try {
    if (await userService.findUserByEmail(usuario.email)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ msg: 'Email informado já está sendo usado.' });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...newUsuario } = await userService.createUser(usuario);
      req.session.uid = newUsuario.id;
      req.session.utid = newUsuario.userTypeId;
      return res.status(StatusCodes.CREATED).send(newUsuario);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.errors);
  }
};

export default { login, logout, signUp };