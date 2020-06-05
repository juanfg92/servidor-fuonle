'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const studyLevelCtrl = require('../controllers/study_level')

api.post('/new-study-level', auth, studyLevelCtrl.newStudyLevel)
api.get('/get-study-level', studyLevelCtrl.getStudyLevels)
api.delete('/delete-study-level', auth, studyLevelCtrl.deleteStudyLevel)
api.put('/update-study-level', auth, studyLevelCtrl.updateStudyLevel)

module.exports = api