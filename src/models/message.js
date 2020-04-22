'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = Schema({
    _id_chat: { type: String, require: true },
    _id_transmitter: { type: String, require: true },
    _id_receiver: { type: String, require: true },
    text: { type: String, require: true },
    received: { type: Boolean, default: false },
    date: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Message', MessageSchema)