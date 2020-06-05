'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')
const classroomCtrl = require('../controllers/classroom')

api.post('/new-restore-user', userCtrl.restorePassword)
api.get('/send-new-password/:restoreid', userCtrl.sendNewPassword)
api.post('/new-restore-classroom', auth, classroomCtrl.restorePassword)
api.get('/send-new-password-classroom/:restoreid/:userid', classroomCtrl.sendNewPassword)

module.exports = api