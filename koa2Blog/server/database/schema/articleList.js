const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleListSchema = new Schema({
    read: {type:Number,default:0},
    comment: {type:Number,default:0},
    title: String,
    img: String,
    content: String,
    brief: String,
    creatDate: {
        type: String,
        default: Date.now()
    },
})

module.exports = mongoose.model('ArticleList', articleListSchema, 'ArticleList')