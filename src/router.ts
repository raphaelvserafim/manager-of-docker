import Router from 'koa-router';
//@ts-ignore
import swaggerUi from 'swagger-ui-koa';
import openapiDocument from './assets/openapi.json';

import { verifyToken, errorHandler } from './middleware';
import { runRouteHandler, startRouteHandler, stopRouteHandler, deleteRouteHandler, listRouteHandler } from './controller';

const router = new Router();

router.prefix('/vdm');
router.use(errorHandler);

// Defina suas rotas normais
router.get('/:token/list', verifyToken, listRouteHandler);
router.get('/:token/:key/run', verifyToken, runRouteHandler);
router.get('/:token/:key/start', verifyToken, startRouteHandler);
router.get('/:token/:key/stop', verifyToken, stopRouteHandler);
router.get('/:token/:key/delete', verifyToken, deleteRouteHandler);

router.get('/api-docs', swaggerUi.setup(openapiDocument));

export default router;
