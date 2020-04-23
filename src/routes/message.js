'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const messageCtrl = require('../controllers/message')

api.post('/send-message', messageCtrl.sendMessage)
api.post('/check-messages', messageCtrl.checkMessages)
api.post('/download-messages', messageCtrl.downloadMessages)
api.post('/download-messages-unread', messageCtrl.downloadMessagesUnread)
api.put('/messages-received', messageCtrl.messagesReceived)

module.exports = api