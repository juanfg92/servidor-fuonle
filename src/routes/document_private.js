'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const doc_privateCtrl = require('../controllers/document_private')

api.post('/upload-document-private', auth, doc_privateCtrl.uploadDocPrivate)
api.get("/send-private-document/:docid", auth, doc_privateCtrl.sendDocPrivate)
api.post('/get-documents-from-section', auth, doc_privateCtrl.getDocumentsFromSection)
api.delete('/delete-private-document/:docid', auth, doc_privateCtrl.deleteDocument)
api.put('/update-private-document', auth, doc_privateCtrl.updateDocument)

module.exports = api