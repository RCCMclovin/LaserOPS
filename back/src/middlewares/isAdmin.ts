import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UserTypes } from '../resources/userType/userType.consts';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.uid || req.session.utid != UserTypes.admin)
    return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
  else next();
}

export default isAdmin;