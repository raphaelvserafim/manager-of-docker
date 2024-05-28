import Router from 'koa-router';
import path from 'path';
import yamljs from 'yamljs';
import { koaSwagger } from 'koa2-swagger-ui';

import { verifyToken, errorHandler } from './middleware';
import {
    runRouteHandler,
    infoRouteHandler,
    restartRouteHandler,
    startRouteHandler,
    stopRouteHandler,
    deleteRouteHandler,
    listRouteHandler
} from './controller';

const router = new Router();

router.use(errorHandler);
// Defina suas rotas normais
router.get('/adm/:token/list', verifyToken, listRouteHandler);
router.get('/adm/:token/:key', verifyToken, infoRouteHandler);
router.get('/adm/:token/:key/run', verifyToken, runRouteHandler);
router.get('/adm/:token/:key/restart', verifyToken, restartRouteHandler);
router.get('/adm/:token/:key/start', verifyToken, startRouteHandler);
router.get('/adm/:token/:key/stop', verifyToken, stopRouteHandler);
router.get('/adm/:token/:key/delete', verifyToken, deleteRouteHandler);

const spec = yamljs.load(path.join(__dirname, '../api.yml'));

router.use(koaSwagger({ swaggerOptions: { spec } }));

router.get('/', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

export default router;