'use strict'

const Doc_private = require('../models/document_private')
const path = require("path")
const fs = require("fs")
const mammoth = require("mammoth")
const pdf2html = require('pdf2html')
const { Poppler } = require('node-poppler');


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

    //get extension
    let spl = req.files.file.name.split(".");
    let ext = spl[spl.length - 1]

    // Save document
    let doc_private = new Doc_private({
        _id_classroom: req.body.classroomId,
        _id_section: req.body.sectionId,
        _id_user: req.body.userId,
        extension: ext,
        documentName: req.body.documentName
    })

    //save document
    doc_private.save((err, doc_private) => {
        if (err) res.status(500).send({ message: `Error creating the comment: ${err}` })

        //upload file and move to section folder
        let EDFile = req.files.file
        let folder = path.resolve(__dirname + "/../../classroom/" + req.body.classroomId + "/" + req.body.sectionId + "/" + doc_private._id + "." + ext);
        EDFile.mv(folder, err => {
            if (err) return res.status(500).send({ message: err })
        })
        return res.status(200).send({ Document_private: doc_private });
    })
}

async function getDocPrivate(req, res) {
    let documentId = req.body.documentId
    let docFound

    //find document
    try {
        docFound = await Doc_private.findOne({ _id: documentId });
        if (!docFound) {
            return res.status(400).send({ message: `no document found: ${documentId}` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // route document
    let folder = path.resolve(__dirname + "/../../classroom/" + docFound._id_classroom + "/" + docFound._id_section + "/" + docFound._id + "." + docFound.extension);
    if (docFound.extension == "docx") {
        var options = {
            styleMap: [
                "b => strong",
                "i => i",
                "u => u",
                "p[style-name='Section Title'] => h1:fresh",
                "p[style-name='Subsection Title'] => h2:fresh"
            ],
            convertImage: mammoth.images.imgElement(function(image) {
                return image.read("base64").then(function(imageBuffer) {
                    return {
                        src: "data:" + image.contentType + ";base64," + imageBuffer
                    };
                });
            })
        };
        mammoth.convertToHtml({ path: folder }, options)
            .then(function(result) {
                var html = result.value; // The generated HTML
                var messages = result.messages; // Any messages, such as warnings during conversion
                return res.status(200).send({ resp: html, message: messages });
            })
            .done();
    }
    if (docFound.extension == "pdf") {

        const options = { text: true }
        pdf2html.pages(folder, options, (err, textPages) => {
            if (err) {
                console.error('Conversion error: ' + err)
            } else {
                return res.status(200).send({ resp: textPages });
            }
        })
    }


}

module.exports = {
    uploadDocPrivate,
    getDocPrivate
}