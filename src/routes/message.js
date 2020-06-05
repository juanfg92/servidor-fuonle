'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const messageCtrl = require('../controllers/message')

api.post('/send-message', auth, messageCtrl.sendMessage)
api.post('/check-messages', auth, messageCtrl.checkMessages)
api.post('/download-messages', auth, messageCtrl.downloadMessages)
api.post('/download-messages-unread', auth, messageCtrl.downloadMessagesUnread)
api.put('/messages-received', auth, messageCtrl.messagesReceived)

module.exports = api