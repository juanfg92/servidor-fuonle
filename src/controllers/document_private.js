'use strict'

const Doc_private = require('../models/document_private')
const fileUpload = require('express-fileupload')
const path = require("path");
const fs = require("fs");


/**
 * controlar extension de documento para almacenarlo y a la hora de recogerlo ponerle su extension
 */



async function uploadDocPrivate(req, res) {
    // Check empty camps
    if (req.body.classroomId == null ||
        req.body.classroomId == "" ||
        req.body.sectionId == null ||
        req.body.sectionId == "" ||
        req.body.userId == null ||
        req.body.userId == "" ||
        req.body.documentName == null ||
        req.body.documentName == "" ||
        req.files.file == undefined) {
        return res.status(500).send({ message: `Error creating the document: empty camps` })
    }

    // documentName validation 
    if (!(/^[A-Za-z][A-Za-z0-9 ]{2,24}$/.test(req.body.documentName))) return res.status(400).send({ message: `the document name must be between 2 and 25 characters, not contain spaces and empy start with a letter` });

    // Save document
    let doc_private = new Doc_private({
        _id_classroom: req.body.classroomId,
        _id_section: req.body.sectionId,
        _id_user: req.body.userId,
        documentName: req.body.documentName
    })

    doc_private.save((err, doc_private) => {
        if (err) res.status(500).send({ message: `Error creating the comment: ${err}` })

        //upload file and move to section folder
        let EDFile = req.files.file
        let folder = path.resolve(__dirname + "/../../classroom/" + req.body.classroomId + "/" + req.body.sectionId + "/" + doc_private._id + ".pdf");
        EDFile.mv(folder, err => {
            if (err) return res.status(500).send({ message: err })
        })
        return res.status(200).send({ Document_private: doc_private });
    })
}

async function getCommentFromSection(req, res) {
    Comment.find({ _id_section: req.body.sectionId }, (err, comments) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (comments.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Comments: comments })
    })
}

module.exports = {
    uploadDocPrivate
}