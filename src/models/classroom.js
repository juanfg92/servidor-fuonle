'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClassroomSchema = Schema({
    _id_user: { type: String, require: true },
    classroomName: { type: String, require: true },
    password: { type: String, require: true },
    blackList: Array,
    administrators: Array,
    creationDate: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Classroom', ClassroomSchema)