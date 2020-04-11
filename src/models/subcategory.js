'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubcategorySchema = Schema({
    _id_category: { type: String, require: true },
    SubcategorytName: { type: String, require: true },
})

module.exports = mongoose.model('Subcategory', SubcategorySchema)