const Router = require('koa-router')
const mongoose = require('mongoose')
//加盐加密
const bcrypt = require('bcryptjs')
//上传
const multer = require('koa-multer');
// 一个实现jwt的包
const jwt = require('jsonwebtoken')
const secret = 'jwt_blog'
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密jsonwebtoken
const fn = require('../database/method')
const User = require('../database/schema/user')
const ArticleList = require('../database/schema/articleList')
const TagList = require('../database/schema/tagList')
const router = new Router()
const HOST = '/blog/api'


//文件上传
//配置
var storage = multer.diskStorage({
    //文件保存路径
    destination: 'public/uploads/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate(),
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = file.originalname.split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({
    storage
});

//登录
router.post(HOST + '/login', async (ctx, next) => {

    let res = mongoose.model('User')
    let req = ctx.request.body
    let data = await res.findOne({
        'userName': req.userName,
        'password': req.password
    })
    if (data) {
        let userToken = {
            name: req.userName
        }
        const token = jwt.sign(userToken, secret, {
            expiresIn: '1d'
        })
        ctx.body = {
            code: 0,
            msg: '登录成功',
            token
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '账号或密码错误'
        }
    }

})

//上传图片
router.post(HOST + '/update_img', upload.single('img'), async (ctx, next) => {
    let res = mongoose.model('ArticleList')
    let req = ctx.request.body

    ctx.body = {
        code: 0,
        msg: '上传成功',
        data: '/' + ctx.req.file.destination + '/' + ctx.req.file.filename
    }

})
//获取标签列表
router.post(HOST + '/tag_list', async (ctx, next) => {
    let res = mongoose.model('TagList')
    let req = ctx.request.body

    let data = await res.find()
    ctx.body = {
        code: 0,
        data
    }

})
//添加标签
router.post(HOST + '/insert_tag', async (ctx, next) => {
    const token = ctx.header.authorization // 获取jwt
    let res = mongoose.model('TagList')
    let req = ctx.request.body
    console.log(req)

    if (token) {
        let payload = await verify(token.split(' ')[1], secret) // // 解密，获取payload
        req.tags = req.tags.split(',')
        let titleArr = []
        for (let i = 0; i < req.tags.length; i++) {

            titleArr.push({
                title: req.tags[i]
            })
        }

        await fn.insert(
            res, titleArr
        ).then(data => {
            ctx.body = {
                code: 0,
                msg: '标签保存成功',
                payload
            }
        })
    } else {
        ctx.body = {
            msg: '无权限操作',
            code: -1
        }
    }

})
//删除标签
router.post(HOST + '/del_tag', async (ctx, next) => {
    const token = ctx.header.authorization // 获取jwt
    let res = mongoose.model('TagList')
    let req = ctx.request.body
    console.log(req)

    if (token) {
        let payload = await verify(token.split(' ')[1], secret) // // 解密，获取payload

        await fn.del(
            res, req.id
        ).then(data => {
            ctx.body = {
                code: 0,
                msg: '删除成功',
                payload
            }
        })
    } else {
        ctx.body = {
            msg: '无权限操作',
            code: -1
        }
    }

})

//获取文章列表
router.post(HOST + '/article_list', async (ctx, next) => {
    let res = mongoose.model('ArticleList'),
        req = ctx.request.body,
        pageSize = req.pageSize, //一页多少条
        currentPage = req.page, //当前第几页
        skipnum = (currentPage - 1) * pageSize, //跳过数
        sort = {
            "created": -1
        }, //排序
        tag, data;

    if (req.tag) {
        tag = req.tag
        //  查询数组跟普通查询一样
        data = await res.find({
            'tags': tag
        },'title created brief img read tags title').sort(sort).skip(skipnum).limit(pageSize)
    } else {
        data = await res.find({},'title created brief img read tags title').sort(sort).skip(skipnum).limit(pageSize)
    }

    ctx.body = {
        code: 0,
        data
    }

})
//插入文章
router.post(HOST + '/insert_article', async (ctx, next) => {
    const token = ctx.header.authorization // 获取jwt
    let res = mongoose.model('ArticleList')
    let req = ctx.request.body

    if (token) {
        let payload = await verify(token.split(' ')[1], secret) // // 解密，获取payload

        await fn.insert(
            res, req
        ).then(data => {

            ctx.body = {
                code: 0,
                msg: '保存成功',
                payload
            }
        })
    } else {
        ctx.body = {
            msg: '无权限操作',
            code: -1
        }
    }

})
//更新文章
router.post(HOST + '/update_article', async (ctx, next) => {
    const token = ctx.header.authorization // 获取jwt
    let res = mongoose.model('ArticleList')
    let req = ctx.request.body

    if (token) {
        let payload = await verify(token.split(' ')[1], secret) // // 解密，获取payload

        await fn.update(
            res,
            req.id,
            req
        ).then(data => {

            ctx.body = {
                code: 0,
                msg: '保存成功',
                payload
            }
        })
    } else {
        ctx.body = {
            msg: '无权限操作',
            code: -1
        }
    }


})
//删除文章
router.post(HOST + '/del_article', async (ctx, next) => {
    const token = ctx.header.authorization // 获取jwt
    let res = mongoose.model('ArticleList')
    let req = ctx.request.body

    if (token) {
        let payload = await verify(token.split(' ')[1], secret) // // 解密，获取payload
        await fn.del(
            res,
            req.id
        ).then(data => {

            ctx.body = {
                code: 0,
                msg: '删除成功',
                payload
            }
        })
    } else {
        ctx.body = {
            msg: '无权限操作',
            code: -1
        }
    }

})
//获取文章详情
router.post(HOST + '/article_detail', async (ctx, next) => {
    let res = mongoose.model('ArticleList')
    let req = ctx.request.body

    await fn.update(
        res,
        req.id, {
            $inc: {
                read: 1
            }
        }
    ).then(data => {
        ctx.body = {
            code: 0,
            data
        }
    })

})
//获取归档列表
router.post(HOST + '/archives', async (ctx, next) => {
    let res = mongoose.model('ArticleList'),
        req = ctx.request.body,
        pageSize = req.pageSize, //一页多少条
        currentPage = req.page, //当前第几页
        skipnum = (currentPage - 1) * pageSize, //跳过数
        //排序
        sort = {               
            "created": -1
        }, 
        data,count;
        /*
            find(查询条件,指定返回字段)
        */
        data = await res.find({},'title created').sort(sort).skip(skipnum).limit(pageSize)
        count = await res.count()
    

    ctx.body = {
        code: 0,
        data,count
    }

})


module.exports = router