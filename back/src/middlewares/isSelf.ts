import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import noteService from '../resources/note/note.service';

export async function isSelf(req: Request, res: Response, next: NextFunction) {
  let param = req.params.userId;
  if(req.params.noteId) {
    param = (await noteService.findNoteById(req.params.noteId as string))?.userId || "";
  }
  if (
    !req.session.uid ||
    req.session.uid != param
  )
    res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
  else next();
}

export default isSelf;