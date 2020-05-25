'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const doc_privateCtrl = require('../controllers/document_private')

api.post('/upload-document-private', doc_privateCtrl.uploadDocPrivate)
api.get("/send-private-document/:docid", doc_privateCtrl.sendDocPrivate)
api.post('/get-documents-from-section', doc_privateCtrl.getDocumentsFromSection)
api.delete('/delete-private-document/:docid', doc_privateCtrl.deleteDocument)
api.put('/update-private-document', doc_privateCtrl.updateDocument)

module.exports = api