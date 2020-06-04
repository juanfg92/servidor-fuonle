'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const classroomCtrl = require('../controllers/classroom')

api.post('/new-classroom', auth, classroomCtrl.newClassroom)
api.post('/check-admin-classroom', classroomCtrl.checkAdmin)
api.post('/check-user-whitelist', classroomCtrl.checkWhiteList)
api.post('/signin-classroom', classroomCtrl.signInClassroom)
api.post('/add-admin-classroom', classroomCtrl.addAdmin)
api.post('/add-user-whitelist', classroomCtrl.addUserWhiteList)
api.post('/get-class-admins', classroomCtrl.getClassAdmins)
api.post('/get-class-whitelist', classroomCtrl.getClassUserWhiteList)
api.post('/delete-admin-classroom', classroomCtrl.deleteAdmin)
api.post('/delete-user-whitelist', classroomCtrl.deleteUserWhiteList)
api.get('/get-classrooms', classroomCtrl.getClassrooms)
api.post('/get-classrooms-by-classroomname', auth, classroomCtrl.getClassroomsByClassroomName)
api.post('/get-classroom-by-id', classroomCtrl.getClassroomById)
api.delete('/delete-classroom/:classroomid', auth, classroomCtrl.deleteClassroom)
api.put('/update-classroom', classroomCtrl.updateClassroom)

module.exports = api