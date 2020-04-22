'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const commentCtrl = require('../controllers/comment')

api.post('/new-comment', commentCtrl.newComment)
api.get('/get-comments-from-section', commentCtrl.getCommentFromSection)
api.delete('/delete-comment', commentCtrl.deleteComment)
api.put('/update-comment', commentCtrl.updateComment)

module.exports = api