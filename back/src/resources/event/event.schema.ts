import Joi from 'joi';

export const CreateEventDTOSchema = Joi.object().keys({
  description: Joi.string().min(3).max(600).required(),
  date: Joi.date().required(),
});