'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SuggestionSchema = Schema({
    _id_user: { type: String, require: true },
    tittle: { type: String, require: true },
    description: { type: String, require: true },
    processed: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Suggestion', SuggestionSchema)