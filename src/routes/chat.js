'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const chatCtrl = require('../controllers/chat')

api.post('/new-chat', chatCtrl.newChat)
api.post('/get-chat', chatCtrl.getChat)
api.delete('/delete-chat', chatCtrl.deleteChat)

module.exports = api