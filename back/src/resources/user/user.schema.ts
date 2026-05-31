import Joi from 'joi';
import { UserTypes } from '../userType/userType.consts';

export const userSchema = Joi.object().keys({
  name: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(40),
  userTypeId: Joi.valid(UserTypes.store, UserTypes.admin, UserTypes.client),
});