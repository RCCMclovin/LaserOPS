import { Router } from 'express';
import isAuth from '../../middlewares/isAuth';
import participantController from './participant.controller';

const router = Router();

router.get('/', isAuth, participantController.index);
router.get('/players', isAuth, participantController.players);
router.get('/spectators', isAuth, participantController.spectators);
router.get('/me', isAuth, participantController.mine);
router.delete('/u/:userId/e/:eventId', isAuth, participantController.removeById);
router.post('/:eventId', isAuth, participantController.createAsSpectator);
router.post('/:eventId/:code', isAuth, participantController.createAsPlayer);
router.delete('/:eventId', isAuth, participantController.remove);

export default router;