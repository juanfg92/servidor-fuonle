'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')

api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)
api.post('/get-user-by-jwt', userCtrl.getUserByJwt)
api.get('/get-users', userCtrl.getUsers)
api.get('/get-user-by-email', userCtrl.getUserByEmail)
api.get('/get-user-by-username', userCtrl.getUserByUserName)
api.delete('/delete-user', userCtrl.deleteUser)
api.put('/update-user', userCtrl.updateUser)

module.exports = api