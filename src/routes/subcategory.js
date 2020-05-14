'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const subcategoryCtrl = require('../controllers/subcategory')

api.post('/new-subcategory', subcategoryCtrl.newSubcategory)
api.post('/get-subcategories-by-study-level-and-category', subcategoryCtrl.getSubcategoriesByStudyLevelAndCategoryId)
api.delete('/delete-subcategory', subcategoryCtrl.deleteSubcategory)
api.put('/update-subcategory', subcategoryCtrl.updateSubcategory)

module.exports = api