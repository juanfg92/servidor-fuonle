'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const classroomCtrl = require('../controllers/classroom')

api.post('/new-classroom', classroomCtrl.newClassroom)
api.post('/check-admin-classroom', classroomCtrl.checkAdmin)
api.post('/signin-classroom', classroomCtrl.signInClassroom)
api.post('/add-admin-classroom', classroomCtrl.addAdmin)
api.post('/delete-admin-classroom', classroomCtrl.deleteAdmin)
api.get('/get-classrooms', classroomCtrl.getClassrooms)
api.post('/get-classrooms-by-classroomname', classroomCtrl.getClassroomsByClassroomName)
api.get('/get-classroom-by-id', classroomCtrl.getClassroomById)
api.delete('/delete-classroom', classroomCtrl.deleteClassroom)
api.put('/update-classroom', classroomCtrl.updateClassroom)

module.exports = api