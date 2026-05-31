import { Router } from 'express';
import storeRequestController from './storeRequest.controller';
import { CreateRequestSchema } from './storeRequest.schema';
import { validate } from '../../middlewares/validate';
import isAdmin from '../../middlewares/isAdmin';
import isAdminOrSelf from '../../middlewares/isAdminOrSelf';
import isAuth from '../../middlewares/isAuth';

const router = Router();

router.get('/', isAdmin, storeRequestController.index);
router.get('/u/:userId', isAdminOrSelf, storeRequestController.indexFromUser);
router.post('/', isAuth, validate(CreateRequestSchema), storeRequestController.create);
router.post('/accept/:requestId', isAdmin, storeRequestController.acceptRequest);
router.post('/refuse/:requestId', isAdmin, storeRequestController.refuseRequest);
router.get('/:requestId', isAuth, storeRequestController.read);
router.delete('/:requestId', isAuth, storeRequestController.remove);

export default router;