'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, select: false, required: true },
    userName: { type: String, unique: true, lowercase: true, required: true },
    token: String,
    _id_docs_favorites: Array,
    avatar: String,
    _id_rol: { type: String, default: "user" },
    signupDate: { type: Date, default: Date.now() },
    lastLogin: Date
})

UserSchema.pre('save', function(next) {
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

// UserSchema.pre('findOneAndUpdate', function(next) {

//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) return next(err)

//         bcrypt.hash(this._update.password, salt, null, (err, hash) => {
//             if (err) return next(err)

//             this._update.password = hash
//             next()
//         })
//     })
// })

UserSchema.methods.gravatar = function(size) {
    if (!size) size = 200
    if (!this.email) return `https://gravatar.com/gravatar/?s=200=retro`

    const md5 = crypto.createHash('md5').update(this.email).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

UserSchema.methods.comparePassword = function(candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch)
    })

}

UserSchema.methods.cryptPassword = function(password, cb) {

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(password, salt, null, (err, hash) => {
            if (err) return next(err)

            cb(err, hash)
        })
    })
}

module.exports = mongoose.model('User', UserSchema)