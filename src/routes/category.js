'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const categoryCtrl = require('../controllers/category')

api.post('/new-category', auth, categoryCtrl.newCategory)
api.post('/get-categories-by-study-level', categoryCtrl.getCategoriesByStudyLevel)
api.delete('/delete-category', auth, categoryCtrl.deleteCategory)
api.put('/update-category', auth, categoryCtrl.updateCategory)

module.exports = api