'use strict'

const express = require('express')
const api = express.Router()
const productControllers = require('../controllers/products')
const auth = require('../middlewares/auth')
const userctrl = require('../controllers/user')
const classroomctrl = require('../controllers/classroom')

api.get('/product/:productId', productControllers.getProduct)
api.get('/products', auth, productControllers.getProducts) //con token
api.get('/products/:productName', productControllers.getProductsForName)
api.put('/product/:productId', productControllers.updateProduct)
api.delete('/product/:productId', productControllers.deleteProduct)
api.post('/product', productControllers.saveProduct)
api.get('/private', auth, (req, res) => {
    res.status(200).send({ message: 'tienes acceso' }) //con token
})

//user
api.post('/signup', userctrl.signUp)
api.post('/signin', userctrl.signIn)
api.get('/get-users', userctrl.getUsers)
api.get('/get-user-by-email', userctrl.getUserByEmail)
api.get('/get-user-by-username', userctrl.getUserByUserName)
api.delete('/delete-user', userctrl.deleteUser)
api.put('/update-user', userctrl.updateUser)

//classroom
api.post('/new-classroom', classroomctrl.newClassroom)
api.get('/get-classrooms', classroomctrl.getClassrooms)
api.get('/get-classrooms-by-classroomname', classroomctrl.getClassroomsByClassroomName)
api.get('/get-classroom-by-id', classroomctrl.getClassroomById)
api.delete('/delete-classroom', classroomctrl.deleteClassroom)


//comment


//document_private


//document_public


//category


//subcategory


//incidence


//message


//rol


//section


//suggestion


module.exports = api