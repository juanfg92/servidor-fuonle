'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SuggestionSchema = Schema({
    _id_user: { type: String, require: true },
    title: { type: String, require: true },
    description: { type: String, require: true },
    creationDate: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Suggestion', SuggestionSchema)