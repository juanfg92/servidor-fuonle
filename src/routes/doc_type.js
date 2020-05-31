'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const doc_typeCtrl = require('../controllers/doc_type')

api.post('/new-doctype', doc_typeCtrl.newDoc_type)
api.get('/get-doctypes', doc_typeCtrl.getDoc_types)
api.post('/get-doctype-by-id', doc_typeCtrl.getDoc_typesById)
api.delete('/delete-doctype', doc_typeCtrl.deleteDoc_type)
api.put('/update-doctype', doc_typeCtrl.updateDoc_type)

module.exports = api