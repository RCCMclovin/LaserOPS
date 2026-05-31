import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import isAdminOrSelf from '../../middlewares/isAdminOrSelf';
import isAuth from '../../middlewares/isAuth';
import eventController from './event.controller';
import { CreateEventDTOSchema } from './event.schema';

const router = Router();

router.get('/', eventController.index);
router.get('/:userId', isAdminOrSelf, eventController.indexFromUser);
router.post('/', isAuth, validate(CreateEventDTOSchema), eventController.create);
router.get('/:eventId', isAuth, eventController.read);
router.delete('/:eventId', isAuth, eventController.remove);

export default router;