'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SectionSchema = Schema({
    _id_classroom: { type: String, require: true },
    password: { type: String, require: true },
    sectionName: { type: String, require: true },
    creationDate: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Section', SectionSchema)