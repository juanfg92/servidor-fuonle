'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const docTypeSchema = Schema({
    docTypeName: { type: String, require: true },
})

module.exports = mongoose.model('docType', docTypeSchema)