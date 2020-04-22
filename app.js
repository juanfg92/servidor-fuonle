'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./src/routes')
const fileUpload = require('express-fileupload')

/* Route Files */
const categoryRoutes = require("./src/routes/category");
const classroomRoutes = require("./src/routes/classroom");
const commentRoutes = require("./src/routes/comment");
const doc_typeRoutes = require("./src/routes/doc_type");
const document_privateRoutes = require("./src/routes/document_private");
const document_publicRoutes = require("./src/routes/document_public");
const incidenceRoutes = require("./src/routes/incidence");
const rolRoutes = require("./src/routes/rol");
const sectionRoutes = require("./src/routes/section");
const study_levelRoutes = require("./src/routes/study_level");
const subcategoryRoutes = require("./src/routes/subcategory");
const suggestionRoutes = require("./src/routes/suggestion");
const userRoutes = require("./src/routes/user");
const messageRoutes = require("./src/routes/message");

/** Middlewares **/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())

/** Routes **/
app.use('/api-aprende-para-crecer', categoryRoutes)
app.use('/api-aprende-para-crecer', classroomRoutes)
app.use('/api-aprende-para-crecer', commentRoutes)
app.use('/api-aprende-para-crecer', doc_typeRoutes)
app.use('/api-aprende-para-crecer', document_privateRoutes)
app.use('/api-aprende-para-crecer', document_publicRoutes)
app.use('/api-aprende-para-crecer', incidenceRoutes)
app.use('/api-aprende-para-crecer', rolRoutes)
app.use('/api-aprende-para-crecer', sectionRoutes)
app.use('/api-aprende-para-crecer', study_levelRoutes)
app.use('/api-aprende-para-crecer', subcategoryRoutes)
app.use('/api-aprende-para-crecer', suggestionRoutes)
app.use('/api-aprende-para-crecer', userRoutes)
app.use('/api-aprende-para-crecer', messageRoutes)

module.exports = app;