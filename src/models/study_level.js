'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studyLevelSchema = Schema({
    studyLevelName: { type: String, require: true },
})

module.exports = mongoose.model('studyLevel', studyLevelSchema)