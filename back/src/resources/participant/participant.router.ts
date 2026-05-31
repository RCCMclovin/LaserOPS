import { Router } from 'express';
import isAuth from '../../middlewares/isAuth';
import participantController from './participant.controller';

const router = Router();

router.get('/', participantController.index);
router.get('/players', participantController.players);
router.get('/spectators', participantController.spectators);
router.delete('/u/:userId/e/:eventId', isAuth, participantController.removeById);
router.post('/:eventId', isAuth, participantController.createAsSpectator);
router.post('/:eventId/:code', isAuth, participantController.createAsPlayer);
router.delete('/:eventId', isAuth, participantController.remove);

export default router;