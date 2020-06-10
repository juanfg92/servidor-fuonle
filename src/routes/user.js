'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')

api.post('/signup', userCtrl.signUp)
api.post('/signin', userCtrl.signIn)
api.post('/get-user-by-jwt', userCtrl.getUserByJwt)
api.get('/get-users', userCtrl.getUsers)
api.post('/get-users-by-email', auth, userCtrl.getUsersByEmail)
api.post('/get-users-by-id', auth, userCtrl.getUsersById)
api.post('/get-user-by-id', auth, userCtrl.getUserById)
api.post('/get-users-by-username', auth, userCtrl.getUserByUserName)
api.post('/get-user-by-email', auth, userCtrl.getUserByEmail)
api.delete('/delete-user', auth, userCtrl.deleteUser)
api.post('/add-doc-favorite', auth, userCtrl.addDocFavorite)
api.post('/get-doc-favorites-user', auth, userCtrl.getDocFavUser)
api.post('/delete-doc-favorite', auth, userCtrl.deleteDocFavorite)
api.put('/update-user', auth, userCtrl.updateUser)

module.exports = api