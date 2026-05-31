import { Schema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import {  StatusCodes } from 'http-status-codes';

export const validate = (schema: Schema) => { 
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.validate(req.body, {
            abortEarly: false
        });
        if (result.error) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(result.error.details);
        } else {
            next();
        }
    }
};