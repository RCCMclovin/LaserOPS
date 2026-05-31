import { Router } from 'express';
import authRouter from '../resources/auth/auth.router';
import userRouter from '../resources/user/user.router';
import storeRequestRouter from '../resources/storeRequest/storeRequest.router';
import eventRouter from '../resources/event/event.router';
import participantRouter from '../resources/participant/participant.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/request', storeRequestRouter);
router.use('/event', eventRouter);
router.use('/participant', participantRouter);

export default router;
