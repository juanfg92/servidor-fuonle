'use strict'

const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema

const ClassroomSchema = Schema({
    _id_user: { type: String, require: true },
    classroomName: { type: String, require: true },
    password: { type: String, require: true, select: false },
    blackList: Array,
    administrators: Array,
    avatar: String,
    lastActivity: Date,
    creationDate: { type: Date, default: Date.now() }
})

ClassroomSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(this.password, salt, null, (err, hash) => {
            if (err) return next(err)

            this.password = hash
            next()
        })
    })
})

ClassroomSchema.pre('findOneAndUpdate', function(next) {

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(this._update.password, salt, null, (err, hash) => {
            if (err) return next(err)

            this._update.password = hash
            next()
        })
    })
})

ClassroomSchema.methods.gravatar = function(size) {
    if (!size) size = 200
    if (!this.classroomName) return `https://gravatar.com/gravatar/?s=200=retro`

    const md5 = crypto.createHash('md5').update(this.classroomName).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

ClassroomSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch)
    });
}

module.exports = mongoose.model('Classroom', ClassroomSchema)