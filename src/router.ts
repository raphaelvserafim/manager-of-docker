import Router from 'koa-router';
import { verifyToken, errorHandler } from './middleware';

import { runRouteHandler, startRouteHandler, stopRouteHandler, deleteRouteHandler, listRouteHandler } from './controller';

const router = new Router();
router.prefix('/v2');
router.use(errorHandler);
router.get('/', (ctx) => { ctx.body = '<h1>OK</h1>'; });
router.get('/:token/list', verifyToken, listRouteHandler);
router.get('/:token/:key/run', verifyToken, runRouteHandler);
router.get('/:token/:key/start', verifyToken, startRouteHandler);
router.get('/:token/:key/stop', verifyToken, stopRouteHandler);
router.get('/:token/:key/delete', verifyToken, deleteRouteHandler);

export default router;