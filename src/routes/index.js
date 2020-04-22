'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')


// api.get('/product/:productId', productControllers.getProduct)
// api.get('/products', auth, productControllers.getProducts) //con token
// api.get('/products/:productName', productControllers.getProductsForName)
// api.put('/product/:productId', productControllers.updateProduct)
// api.delete('/product/:productId', productControllers.deleteProduct)
// api.post('/product', productControllers.saveProduct)
// api.get('/private', auth, (req, res) => {
//     res.status(200).send({ message: 'tienes acceso' }) //con token
// })


//message


module.exports = api