'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const sectionCtrl = require('../controllers/section')

api.post('/new-section', auth, sectionCtrl.newSection)
api.post('/get-sections-from-classroom', auth, sectionCtrl.getSectionFromClassroom)
api.post('/get-section-by-id', auth, sectionCtrl.getSectionById)
api.delete('/delete-section/:sectionid/:classroomid', auth, sectionCtrl.deleteSection)
api.put('/update-section', auth, sectionCtrl.updateSection)

module.exports = api