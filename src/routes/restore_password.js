'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')
const classroomCtrl = require('../controllers/classroom')

api.post('/new-restore-user', userCtrl.restorePassword)
api.get('/send-new-password/:restoreid', userCtrl.sendNewPassword)
    // api.post('/get-rol-by-id', rolCtrl.getRolById)
    // api.get('/get-all-rols', auth, rolCtrl.getAllrols)
    // api.delete('/delete-rol', auth, rolCtrl.deleteRol)
    // api.put('/update-rol', auth, rolCtrl.updateRol)

module.exports = api