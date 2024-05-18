import Router from 'koa-router';
import { verifyToken, errorHandler } from './middleware';

import { runRouteHandler, startRouteHandler, stopRouteHandler, deleteRouteHandler, listRouteHandler } from './controller';

const router = new Router();
router.prefix('/vdm');
router.use(errorHandler);
router.get('/:token/list', verifyToken, listRouteHandler);
router.get('/:token/:key/run', verifyToken, runRouteHandler);
router.get('/:token/:key/start', verifyToken, startRouteHandler);
router.get('/:token/:key/stop', verifyToken, stopRouteHandler);
router.get('/:token/:key/delete', verifyToken, deleteRouteHandler);

export default router;