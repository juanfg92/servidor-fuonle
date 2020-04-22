'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const studyLevelCtrl = require('../controllers/study_level')

api.post('/new-study-level', studyLevelCtrl.newStudyLevel)
api.get('/get-study-level', studyLevelCtrl.getStudyLevels)
api.delete('/delete-study-level', studyLevelCtrl.deleteStudyLevel)
api.put('/update-study-level', studyLevelCtrl.updateStudyLevel)

module.exports = api