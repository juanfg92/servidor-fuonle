'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = Schema({
    CategorytName: { type: String, require: true },
})

module.exports = mongoose.model('Category', CategorySchema)