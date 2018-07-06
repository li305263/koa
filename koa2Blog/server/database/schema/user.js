const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName:{
        unique:true,
        type:String
    },
    password:String,
    creatDate:{ type:String , default:Date.now()},
})

module.exports = mongoose.model('User',userSchema,'User')