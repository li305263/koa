const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName:{
        unique:true,
        type:String
    },
    userPwd:String,
    creatDate:{ type:Date , default:Date.now()},
})

module.exports = mongoose.model('User',userSchema)