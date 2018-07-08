const koa = require('koa')
const app = new koa()
const router = require('./server/router')
const koaBody = require('koa-body')
const serve  = require("koa-static");
 //验证jwt的koa中间件
const jwtKoa = require('koa-jwt')
const secret = 'jwt_blog'
const connect = require('./server/database/init')

;(async ()=>{
 await connect
})()

 app.use(async (ctx,next)=>{
    try{
        await next()
    }catch (err){
        ctx.status = err.statusCode || err.status || 500
        cts.bosy = {
            msg:err.message
        }
    }
 })
 // x-response-time
app.use(async (ctx,next)=>{
    const start = Date.now()

    await next()

    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
})
//logger
app.use(async(ctx,next)=>{
    const start = Date.now()

    await next()

    const ms = Date.now() - start

    console.log(`${ctx.method} ${ctx.url} ${ms}ms`)
})
app.use(serve(__dirname))
app.use(koaBody())
app.use(jwtKoa({secret}).unless({
        path: [/^\/login/,/^\/article_list/,/^\/tag_list/,/^\/article_detail/] //数组中的路径不需要通过jwt验证
    }))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3001)