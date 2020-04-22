'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const sectionCtrl = require('../controllers/section')

api.post('/new-section', sectionCtrl.newSection)
api.get('/get-sections-from-classroom', sectionCtrl.getSectionFromClassroom)
api.delete('/delete-section', sectionCtrl.deleteSection)
api.put('/update-section', sectionCtrl.updateSection)

module.exports = api