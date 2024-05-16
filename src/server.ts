import Koa from 'koa';
import { envs } from './configs/env';
import router from './router';

async function server() {
  try {
    const app = new Koa();
    app.use(router.routes());
    app.listen(envs.serverPort);
    console.log(`Server initialized on port ${envs.serverPort}`);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}


export default server;