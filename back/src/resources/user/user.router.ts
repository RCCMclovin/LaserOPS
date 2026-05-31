import { Router } from 'express';
import userController from './user.controller';
import { userSchema } from './user.schema';
import { validate } from '../../middlewares/validate';
import isAdmin from '../../middlewares/isAdmin';
import isAdminOrSelf from '../../middlewares/isAdminOrSelf';

const router = Router();

router.get('/', isAdmin, userController.index);
router.post('/', isAdmin, validate(userSchema), userController.create);
router.get('/checkemail/:email', userController.checkEmail);
router.get('/:userId', userController.read);
router.put(
  '/:userId',
  isAdminOrSelf,
  validate(userSchema),
  userController.update,
);
router.delete('/:userId', isAdminOrSelf, userController.remove);

export default router;