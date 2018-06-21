const koa = require('koa')
const app = new koa()
const router = require('./router/index')
const koaBody = require('koa-body')

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

app.use(koaBody())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3001)