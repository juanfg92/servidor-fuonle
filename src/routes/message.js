'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const messageCtrl = require('../controllers/message')

api.post('/send-message', messageCtrl.sendMessage)
api.post('/check-messages', messageCtrl.checkMessages)
api.post('/download-messages-read', messageCtrl.downloadMessagesRead)
api.post('/download-messages-unread', messageCtrl.downloadMessagesUnread)
api.post('/messages-received', messageCtrl.messagesReceived)

module.exports = api