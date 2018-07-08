const mongoose = require('mongoose')
const Schema = mongoose.Schema
const tagListSchema = new Schema({
    title: String
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

module.exports = mongoose.model('TagList', tagListSchema, 'TagList')