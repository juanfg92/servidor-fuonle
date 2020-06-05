'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const rolCtrl = require('../controllers/rol')

api.post('/new-rol', auth, rolCtrl.newRol)
api.post('/get-rol-by-id', rolCtrl.getRolById)
api.get('/get-all-rols', auth, rolCtrl.getAllrols)
api.delete('/delete-rol', auth, rolCtrl.deleteRol)
api.put('/update-rol', auth, rolCtrl.updateRol)

module.exports = api