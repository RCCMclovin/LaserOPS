import { Router } from 'express';
import authRouter from '../resources/auth/auth.router';
import userRouter from '../resources/user/user.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
