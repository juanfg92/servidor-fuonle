'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const sectionCtrl = require('../controllers/section')

api.post('/new-section', sectionCtrl.newSection)
api.post('/get-sections-from-classroom', sectionCtrl.getSectionFromClassroom)
api.post('/get-section-by-id', sectionCtrl.getSectionById)
api.delete('/delete-section/:sectionid/:classroomid', sectionCtrl.deleteSection)
api.put('/update-section', sectionCtrl.updateSection)

module.exports = api