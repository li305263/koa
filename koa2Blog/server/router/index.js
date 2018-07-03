const Router = require('koa-router')
const mongoose = require('mongoose')
const User = require('../database/schema/user')
const router = new Router()

router.post('/user_list',async (ctx,next)=>{


    let user = mongoose.model('User')
    let data = await user.find()
    ctx.body = {
        code:0,
        data
    }

})

module.exports = router