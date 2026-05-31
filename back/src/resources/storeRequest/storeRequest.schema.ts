import Joi from 'joi';

export const CreateRequestSchema = Joi.object().keys({
  text: Joi.string().min(3).max(600).required(),
});