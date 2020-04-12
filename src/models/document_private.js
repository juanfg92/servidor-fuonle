'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Document_privateSchema = Schema({
    _id_classroom: { type: String, require: true },
    _id_section: { type: String, require: true },
    _id_user: { type: String, require: true },
    documentName: { type: String, require: true },
    description: String,
    uploadDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Document_private', Document_privateSchema)