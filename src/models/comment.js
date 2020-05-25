'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = Schema({
    _id_classroom: { type: String, require: true },
    _id_section: { type: String, require: true },
    _id_user: { type: String, require: true },
    writeAdmin: { type: Boolean, default: false },
    text: { type: String, require: true },
    creationDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Comment', CommentSchema)