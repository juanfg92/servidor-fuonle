'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Document_publicSchema = Schema({
    _id_user: { type: String, require: true },
    documentName: { type: String, require: true },
    description: String,
    uploadDate: { type: Date, default: Date.now() },
    filter: Array
})

module.exports = mongoose.model('Document_public', Document_publicSchema)