'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Document_publicSchema = Schema({
    _id_user: { type: String, require: true },
    documentName: { type: String, require: true },
    description: { type: String, require: true },
    _id_studyLevel: { type: String, require: true },
    _id_category: { type: String, require: true },
    _id_subcategory: { type: String, require: true },
    _id_doc_type: { type: String, require: true },
    extension: { type: String, require: true },
    uploadDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Document_public', Document_publicSchema)