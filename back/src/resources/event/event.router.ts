import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import isAuth from '../../middlewares/isAuth';
import eventController from './event.controller';
import { CreateEventDTOSchema } from './event.schema';

const router = Router();

router.get('/', isAuth, eventController.index);
router.post('/publish/:eventId', isAuth, eventController.togglePublish);
router.get('/read/:eventId', isAuth, eventController.read);
router.get('/:userId', isAuth, eventController.indexFromUser);
router.post('/', isAuth, validate(CreateEventDTOSchema), eventController.create);
router.put('/:eventId', isAuth, validate(CreateEventDTOSchema), eventController.update);
router.delete('/:eventId', isAuth, eventController.remove);

export default router;