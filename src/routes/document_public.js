'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const doc_publicCtrl = require('../controllers/document_public')

api.post('/upload-document-public', doc_publicCtrl.uploadDocPublic)
api.get('/get-public-documents', doc_publicCtrl.getDocsPublic)
api.post('/get-public-documents-filter', doc_publicCtrl.getDocsPublicByFilter)
api.get('/send-public-document/:docid', doc_publicCtrl.sendDocument)
api.post('/get-public-document-by-id', doc_publicCtrl.getPublicDocById)
api.post('/get-public-document-by-userid', doc_publicCtrl.getPublicDocByUserId)
api.delete('/delete-public-document/:docid', doc_publicCtrl.deleteDocument)
api.put('/update-public-document', doc_publicCtrl.updateDocument)

module.exports = api