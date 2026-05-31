import { Router } from 'express';
import routerV1 from './routerV1';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger-output.json';

const router = Router();

router.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile));//#swagger.tags = ["Api Info"]

router.use('/v1', routerV1); //#swagger.tags = ["V1"]

export default router;