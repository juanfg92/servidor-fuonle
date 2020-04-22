'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const classroomCtrl = require('../controllers/classroom')

api.post('/new-classroom', classroomCtrl.newClassroom)
api.post('/check-admin-classroom', classroomCtrl.checkAdmin)
api.post('/add-admin-classroom', classroomCtrl.addAdmin)
api.get('/get-classrooms', classroomCtrl.getClassrooms)
api.get('/get-classrooms-by-classroomname', classroomCtrl.getClassroomsByClassroomName)
api.get('/get-classroom-by-id', classroomCtrl.getClassroomById)
api.delete('/delete-classroom', classroomCtrl.deleteClassroom)
api.put('/update-classroom', classroomCtrl.updateClassroom)

module.exports = api