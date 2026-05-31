import Joi from 'joi';

export const CreateEventDTOSchema = Joi.object().keys({
  text: Joi.string().min(3).max(600).required(),
  date: Joi.date().required(),
});