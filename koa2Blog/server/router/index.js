const Router = require('koa-router')
const mongoose = require('mongoose')
const fn = require('../database/method')
const User = require('../database/schema/user')
const ArticleList = require('../database/schema/articleList')
const router = new Router()

router.post('/user_list', async (ctx, next) => {

    let res = mongoose.model('User')
    let data = await res.find()
    ctx.body = {
        code: 0,
        data
    }

})
//获取文章列表
router.post('/article_list', async (ctx, next) => {

    let res = mongoose.model('ArticleList')
    let req = ctx.request.body
    var pageSize = req.pageSize; //一页多少条
    var currentPage = req.page; //当前第几页
    var skipnum = (currentPage - 1) * pageSize; //跳过数

    let data = await res.find().skip(skipnum).limit(pageSize)
    ctx.body = {
        code: 0,
        data
    }

})
//插入文章
router.post('/insert_article_list', async (ctx, next) => {

    let res = mongoose.model('ArticleList')
    let req = ctx.request.body

    await fn.insert(
        new res({
            title: req.title,
            img: req.img,
            content: req.content,
            brief: req.brief,
        })
    )
    ctx.body = {
        code: 0
    }

})
//更新文章
router.post('/update_article_list', async (ctx, next) => {

    let res = mongoose.model('ArticleList')
    let req = ctx.request.body
    await fn.update(
        res,
        req.id,
        ...req
    )
    ctx.body = {
        code: 0
    }

})

module.exports = router