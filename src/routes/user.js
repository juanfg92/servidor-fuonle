'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')

api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)
api.post('/get-user-by-jwt', userCtrl.getUserByJwt)
api.get('/get-users', userCtrl.getUsers)
api.post('/get-users-by-email', userCtrl.getUsersByEmail)
api.post('/get-users-by-id', userCtrl.getUsersById)
api.post('/get-user-by-id', userCtrl.getUserById)
api.post('/get-users-by-username', userCtrl.getUserByUserName)
api.post('/get-user-by-email', userCtrl.getUserByEmail)
api.delete('/delete-user', userCtrl.deleteUser)
api.post('/add-doc-favorite', userCtrl.addDocFavorite)
api.post('/delete-doc-favorite', userCtrl.deleteDocFavorite)
api.put('/update-user', userCtrl.updateUser)

module.exports = api