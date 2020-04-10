'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IncidenceSchema = Schema({
    _id_user: { type: String, require: true },
    _id_document: { type: String, require: true },
    description: { type: String, require: true },
    creationDate: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Incidence', IncidenceSchema)