import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import isAdminOrSelf from '../../middlewares/isAdminOrSelf';
import isAuth from '../../middlewares/isAuth';
import eventController from './event.controller';
import { CreateEventDTOSchema } from './event.schema';
import userController from '../user/user.controller';

const router = Router();

router.get('/', eventController.index);
router.get('/:userId', isAdminOrSelf, eventController.indexFromUser);
router.post('/', isAuth, validate(CreateEventDTOSchema), eventController.create);
router.put('/:userId', isAdminOrSelf, validate(CreateEventDTOSchema), userController.update);
router.get('/:eventId', isAuth, eventController.read);
router.delete('/:eventId', isAuth, eventController.remove);
router.post('/publish', isAuth, eventController.togglePublish);

export default router;