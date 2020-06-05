'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const subcategoryCtrl = require('../controllers/subcategory')

api.post('/new-subcategory', auth, subcategoryCtrl.newSubcategory)
api.post('/get-subcategories-by-study-level-and-category', subcategoryCtrl.getSubcategoriesByStudyLevelAndCategoryId)
api.delete('/delete-subcategory', auth, subcategoryCtrl.deleteSubcategory)
api.put('/update-subcategory', auth, subcategoryCtrl.updateSubcategory)

module.exports = api