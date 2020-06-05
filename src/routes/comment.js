'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const commentCtrl = require('../controllers/comment')

api.post('/new-comment', auth, commentCtrl.newComment)
api.post('/get-comments-from-section', auth, commentCtrl.getCommentFromSection)
api.delete('/delete-comment', auth, commentCtrl.deleteComment)
api.delete('/delete-all-comments/:sectionid', auth, commentCtrl.deleteAllComments)
api.put('/update-comment', auth, commentCtrl.updateComment)

module.exports = api