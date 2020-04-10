'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RolSchema = Schema({
    name: { type: String, require: true },
    category: { type: String, enum: ['admin', 'user'], require: true },
    description: String
})

module.exports = mongoose.model('Rol', RolSchema)