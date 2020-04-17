'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = Schema({
    _id_studyLevel: { type: String, require: true },
    categoryName: { type: String, require: true },
})

module.exports = mongoose.model('Category', CategorySchema)