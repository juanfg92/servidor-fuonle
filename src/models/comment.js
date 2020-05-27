'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = Schema({
    _id_classroom: { type: String, require: true },
    _id_section: { type: String, require: true },
    _id_user: { type: String, require: true },
    userName: { type: String, require: true },
    writeAdmin: { type: Boolean, default: false },
    text: { type: String, require: true },
    dateString: { type: String, require: true },
    creationDate: { type: Date, default: Date.now() }
})

CommentSchema.pre('save', function(next) {

    let date_ob = new Date();
    let date = date_ob.getDate();
    if (date < 10) date = `${'0'+date}`
    let month = date_ob.getMonth() + 1;
    if (month < 10) month = `${'0'+month}`
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    if (hours < 10) hours = `${'0'+hours}`
    let minutes = date_ob.getMinutes();
    if (minutes < 10) minutes = `${'0'+minutes}`
    let seconds = date_ob.getSeconds();
    if (seconds < 10) seconds = `${'0'+seconds}`
    let dateDisplay = `${date}/${month}/${year}  ${hours}:${minutes}:${seconds}`;

    this.dateString = dateDisplay
    next()
})

module.exports = mongoose.model('Comment', CommentSchema)