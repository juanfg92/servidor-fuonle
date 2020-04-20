'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const userctrl = require('../controllers/user')
const classroomctrl = require('../controllers/classroom')
const sectionctrl = require('../controllers/section')
const commentctrl = require('../controllers/comment')
const doc_privatectrl = require('../controllers/document_private')
const doc_publicctrl = require('../controllers/document_public')
const studyLevelctrl = require('../controllers/study_level')
const categoryctrl = require('../controllers/category')
const subcategoryctrl = require('../controllers/subcategory')
const doc_typectrl = require('../controllers/doc_type')

// api.get('/product/:productId', productControllers.getProduct)
// api.get('/products', auth, productControllers.getProducts) //con token
// api.get('/products/:productName', productControllers.getProductsForName)
// api.put('/product/:productId', productControllers.updateProduct)
// api.delete('/product/:productId', productControllers.deleteProduct)
// api.post('/product', productControllers.saveProduct)
// api.get('/private', auth, (req, res) => {
//     res.status(200).send({ message: 'tienes acceso' }) //con token
// })

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
api.put('/update-classroom', classroomctrl.updateClassroom)

//section
api.post('/new-section', sectionctrl.newSection)
api.get('/get-sections-from-classroom', sectionctrl.getSectionFromClassroom)
api.delete('/delete-section', sectionctrl.deleteSection)
api.put('/update-section', sectionctrl.updateSection)

//comment
api.post('/new-comment', commentctrl.newComment)
api.get('/get-comments-from-section', commentctrl.getCommentFromSection)
api.delete('/delete-comment', commentctrl.deleteComment)
api.put('/update-comment', commentctrl.updateComment)

//document_private
api.post('/upload-document-private', doc_privatectrl.uploadDocPrivate)
api.post('/get-private-document', doc_privatectrl.getDocPrivate)
api.post('/get-documents-from-section', doc_privatectrl.getDocumentsFromSection)
api.delete('/delete-private-document', doc_privatectrl.deleteDocument)
api.put('/update-private-document', doc_privatectrl.updateDocument)

//document_public
api.post('/upload-document-public', doc_publicctrl.uploadDocPublic)
api.get('/get-public-documents', doc_publicctrl.getDocsPublic)
api.post('/get-public-documents-filter', doc_publicctrl.getDocsPublicByFilter)
api.post('/send-public-document', doc_publicctrl.sendDocument)
api.delete('/delete-public-document', doc_publicctrl.deleteDocument)
api.put('/update-public-document', doc_publicctrl.updateDocument)

//studyLevel
api.post('/new-study-level', studyLevelctrl.newStudyLevel)
api.get('/get-study-level', studyLevelctrl.getStudyLevels)
api.delete('/delete-study-level', studyLevelctrl.deleteStudyLevel)
api.put('/update-study-level', studyLevelctrl.updateStudyLevel)

//category
api.post('/new-category', categoryctrl.newCategory)
api.get('/get-categories-by-study-level', categoryctrl.getCategoriesByStudyLevel)
api.delete('/delete-category', categoryctrl.deleteCategory)
api.put('/update-category', categoryctrl.updateCategory)

//subcategory
api.post('/new-subcategory', subcategoryctrl.newSubcategory)
api.get('/get-subcategories-by-study-level-and-category', subcategoryctrl.getSubcategoriesByStudyLevelAndCategoryId)
api.delete('/delete-subcategory', subcategoryctrl.deleteSubcategory)
api.put('/update-subcategory', subcategoryctrl.updateSubcategory)

//docType
api.post('/new-doctype', doc_typectrl.newDoc_type)
api.get('/get-doctypes', doc_typectrl.getDoc_types)
api.delete('/delete-doctype', doc_typectrl.deleteDoc_type)
api.put('/update-doctype', doc_typectrl.updateDoc_type)

//incidence


//message


//rol


//suggestion


module.exports = api