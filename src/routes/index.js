'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const userctrl = require('../controllers/user')
const classroomctrl = require('../controllers/classroom')
const sectionctrl = require('../controllers/section')
const commentctrl = require('../controllers/comment')
const doc_privatectrl = require('../controllers/document_private')

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
api.delete('/delete-document', doc_privatectrl.deleteDocument)
api.put('/update-document', doc_privatectrl.updateDocument)

//document_public


//studyLevel


//category


//subcategory


//incidence


//message


//rol


//suggestion


module.exports = api