import { Router } from 'express';
import authController from './auth.controller';
import authSchemas from './auth.schema';
import { validate } from '../../middlewares/validate';
import isAuth from '../../middlewares/isAuth';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 10,
 message: {
   error: 'Excesso de requisições de autenticação, tente novamente mais tarde.',
   retryAfter: '15 minutes',
 },
 standardHeaders: true,
 legacyHeaders: false, 
});

const router = Router();

router.use(limiter);

router.post(
  '/signup',
  validate(authSchemas.signupSchema),
  authController.signUp,
);
router.post('/login', validate(authSchemas.authSchema), authController.login);
router.post('/logout', isAuth, authController.logout);


export default router;