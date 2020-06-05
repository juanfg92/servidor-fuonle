'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RestorePasswordSchema = Schema({
    _id_subject: { type: String, require: true },
    finished: { type: Boolean, require: true, default: false },
})

module.exports = mongoose.model('RestorePassword', RestorePasswordSchema)