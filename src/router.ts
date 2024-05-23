import Router from 'koa-router';
import path from 'path';
import yamljs from 'yamljs';
import { koaSwagger } from 'koa2-swagger-ui';

import { verifyToken, errorHandler } from './middleware';
import { runRouteHandler, startRouteHandler, stopRouteHandler, deleteRouteHandler, listRouteHandler } from './controller';

const router = new Router();

router.use(errorHandler);

// Defina suas rotas normais
router.get('/:token/list', verifyToken, listRouteHandler);
router.get('/:token/:key/run', verifyToken, runRouteHandler);
router.get('/:token/:key/start', verifyToken, startRouteHandler);
router.get('/:token/:key/stop', verifyToken, stopRouteHandler);
router.get('/:token/:key/delete', verifyToken, deleteRouteHandler);


const spec = yamljs.load(path.join(__dirname, '../api.yml'));

router.use(koaSwagger({ swaggerOptions: { spec } }));

router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));


export default router;
