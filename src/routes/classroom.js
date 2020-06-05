'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const classroomCtrl = require('../controllers/classroom')

api.post('/new-classroom', auth, classroomCtrl.newClassroom)
api.post('/check-admin-classroom', auth, classroomCtrl.checkAdmin)
api.post('/check-user-whitelist', auth, classroomCtrl.checkWhiteList)
api.post('/signin-classroom', auth, classroomCtrl.signInClassroom)
api.post('/add-admin-classroom', auth, classroomCtrl.addAdmin)
api.post('/add-user-whitelist', auth, classroomCtrl.addUserWhiteList)
api.post('/get-class-admins', auth, classroomCtrl.getClassAdmins)
api.post('/get-class-whitelist', auth, classroomCtrl.getClassUserWhiteList)
api.post('/delete-admin-classroom', auth, classroomCtrl.deleteAdmin)
api.post('/delete-user-whitelist', auth, classroomCtrl.deleteUserWhiteList)
api.get('/get-classrooms', auth, classroomCtrl.getClassrooms)
api.post('/get-classrooms-by-classroomname', auth, classroomCtrl.getClassroomsByClassroomName)
api.post('/get-classroom-by-id', auth, classroomCtrl.getClassroomById)
api.delete('/delete-classroom/:classroomid', auth, classroomCtrl.deleteClassroom)
api.put('/update-classroom', auth, classroomCtrl.updateClassroom)

module.exports = api