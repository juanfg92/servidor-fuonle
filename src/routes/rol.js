'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const rolCtrl = require('../controllers/rol')

api.post('/new-rol', rolCtrl.newRol)
api.post('/get-rol-by-id', rolCtrl.getRolById)
api.get('/get-all-rols', rolCtrl.getAllrols)
api.delete('/delete-rol', rolCtrl.deleteRol)
api.put('/update-rol', rolCtrl.updateRol)

module.exports = api