'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const categoryCtrl = require('../controllers/category')

api.post('/new-category', categoryCtrl.newCategory)
api.get('/get-categories-by-study-level', categoryCtrl.getCategoriesByStudyLevel)
api.delete('/delete-category', categoryCtrl.deleteCategory)
api.put('/update-category', categoryCtrl.updateCategory)

module.exports = api