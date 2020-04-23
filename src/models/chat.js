'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = Schema({
    _id_user1: { type: String, require: true },
    _id_user2: { type: String, require: true },
    date: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Chat', ChatSchema)