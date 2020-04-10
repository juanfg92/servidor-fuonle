'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = Schema({
    _id_transmitter: { type: String, require: true },
    _id_receiver: { type: String, require: true },
    text: { type: String, require: true },
    date: { type: Date, default: Date.now() },
    read: Boolean,
})

module.exports = mongoose.model('Message', MessageSchema)