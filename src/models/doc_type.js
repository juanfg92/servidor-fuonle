'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const docTypeSchema = Schema({
    doc_typeName: { type: String, require: true },
})

module.exports = mongoose.model('docType', docTypeSchema)