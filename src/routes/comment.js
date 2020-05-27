'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const commentCtrl = require('../controllers/comment')

api.post('/new-comment', commentCtrl.newComment)
api.post('/get-comments-from-section', commentCtrl.getCommentFromSection)
api.delete('/delete-comment', commentCtrl.deleteComment)
api.delete('/delete-all-comments', commentCtrl.deleteAllComments)
api.put('/update-comment', commentCtrl.updateComment)

module.exports = api