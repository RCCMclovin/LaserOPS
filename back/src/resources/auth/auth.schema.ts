import Joi from 'joi';

const authSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signupSchema = Joi.object().keys({
  name: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128)
  .pattern(new RegExp('^(?=.*[a-z])')) // pelo menos uma minúscula
  .pattern(new RegExp('^(?=.*[A-Z])')) // pelo menos uma maiúscula
  .pattern(new RegExp('^(?=.*\\d)'))   // pelo menos um número
  .pattern(new RegExp('^(?=.*[!@#$%^&*(),.?":{}|<>\\[\\]\\\\/`~;\'_+=-])')) // pelo menos um símbolo
  .required()
  .messages({
    'string.base': 'A senha deve ser um texto',
    'string.empty': 'A senha não pode estar vazia',
    'string.min': 'A senha deve ter no mínimo 8 caracteres',
    'string.max': 'A senha deve ter no máximo 128 caracteres',
    'string.pattern.base': 'A senha deve conter letra minúscula, maiúscula, número e símbolo',
    'any.required': 'A senha é obrigatória'
  }),
});

export default { authSchema, signupSchema };