 const koa = require('koa')
 const app = new koa()
 app.use(async function(cxt,next) {
     cxt.body = 'hello koa2'
 }).listen(3001)