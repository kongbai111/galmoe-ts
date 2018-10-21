import * as path from 'path';
import * as Koa from 'koa';
import * as Router from 'koa-router';
// import {appRoutes} from './routes'
import {serve} from '../config'
import * as router from './routes'
const koaStatic = require('koa-static')
const staticCache = require('koa-static-cache')
const cors = require('koa2-cors')

const app = new Koa();
// const router = new Router();

app
  .use(cors({
  origin: function () {
    // if (ctx.url === '/test') {
    //   return "*"; // test开放
    // }
    // return 'http://localhost'
    return serve.cors
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: serve.maxAge
}))

app.use(async (ctx, next) => {
  const start = Date.now()
  try {
    await next()
    let ms = Date.now() - start
    // 记录所有日志
    // if (ctx.status) {
    //   logger.logResponse(ctx, ms)
    console.log(`${ctx.request.method} ${ctx.url} ${ms}`)
    // }
  } catch (err) {
    // 记录错误日志
    console.error(err)
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      error: err.message
    }
    // console.error(`${ctx.request.method} ${ctx.url} ${errorms}`)
    // logger.logError(ctx, error, errorms)
  }
})

app.use(router.routes());

app.listen(serve.port);

console.log(`Server running on port ${serve.port}`);