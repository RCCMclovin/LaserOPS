import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import isAdminOrSelf from '../../middlewares/isAdminOrSelf';
import isAuth from '../../middlewares/isAuth';
import eventController from './event.controller';
import { CreateEventDTOSchema } from './event.schema';

const router = Router();

router.get('/', isAuth, eventController.index);
router.post('/publish/:eventId', isAuth, eventController.togglePublish);
router.get('/:userId', isAuth, eventController.indexFromUser);
router.post('/', isAuth, validate(CreateEventDTOSchema), eventController.create);
router.put('/:eventId', isAdminOrSelf, validate(CreateEventDTOSchema), eventController.update);
router.get('/read/:eventId', isAuth, eventController.read);
router.delete('/:eventId', isAuth, eventController.remove);

export default router;