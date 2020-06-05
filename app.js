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
const chatRoutes = require("./src/routes/chat");
const restorePassword = require("./src/routes/restore_password");

/** Middlewares **/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())

/** CORS **/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

    next();
});


/** Routes **/
app.use('/api-fuonle', categoryRoutes)
app.use('/api-fuonle', classroomRoutes)
app.use('/api-fuonle', commentRoutes)
app.use('/api-fuonle', doc_typeRoutes)
app.use('/api-fuonle', document_privateRoutes)
app.use('/api-fuonle', document_publicRoutes)
app.use('/api-fuonle', incidenceRoutes)
app.use('/api-fuonle', rolRoutes)
app.use('/api-fuonle', sectionRoutes)
app.use('/api-fuonle', study_levelRoutes)
app.use('/api-fuonle', subcategoryRoutes)
app.use('/api-fuonle', suggestionRoutes)
app.use('/api-fuonle', userRoutes)
app.use('/api-fuonle', messageRoutes)
app.use('/api-fuonle', chatRoutes)
app.use('/api-fuonle', restorePassword)

module.exports = app;