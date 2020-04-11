'use strict'

const express = require('express')
const api = express.Router()
const productControllers = require('../controllers/products')
const auth = require('../middlewares/auth')
const userctrl = require('../controllers/user')

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
api.get('/getusers', userctrl.getUsers)
api.get('/getuserbyemail', userctrl.getUserByEmail)
api.get('/getuserbyusername', userctrl.getUserByUserName)
api.delete('/deleteuser', userctrl.deleteUser)

//classroom


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