'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const doc_publicCtrl = require('../controllers/document_public')

api.post('/upload-document-public', doc_publicCtrl.uploadDocPublic)
api.get('/get-public-documents', doc_publicCtrl.getDocsPublic)
api.post('/get-public-documents-filter', doc_publicCtrl.getDocsPublicByFilter)
api.post('/send-public-document', doc_publicCtrl.sendDocument)
api.delete('/delete-public-document', doc_publicCtrl.deleteDocument)
api.put('/update-public-document', doc_publicCtrl.updateDocument)

module.exports = api