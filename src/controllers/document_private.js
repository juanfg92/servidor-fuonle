'use strict'

const Doc_private = require('../models/document_private')
const path = require("path")
const fs = require("fs")
const mammoth = require("mammoth")
const pdf2html = require("pdf2html")

/**
 * upload file (.docx|.pdf)
 * @param {*} req 
 * @param {*} res 
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
    if (!(/^[A-Za-zÁÉÍÓÚáéíóú][A-Za-zÁÉÍÓÚáéíóú0-9 /*-+,.-_!"'^`{}<>ºª%&()]{2,50}$/.test(req.body.documentName))) return res.status(400).send({ message: `the document name must be between 2 and 50 characters, not contain spaces and empy start with a letter` });

    //get extension
    let spl = req.files.file.name.split(".");
    let ext = spl[spl.length - 1]

    //extension validation
    if (!(/^(docx)$/.test(ext))) return res.status(400).send({ message: `the document extension must be .docx` });

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
        let folder = path.resolve(__dirname + "/../../classroom/" + req.body.classroomId + "/" + req.body.sectionId + "/" + doc_private._id);

        EDFile.mv(folder, err => {
            if (err) return res.status(500).send({ message: err })
        })
        return res.status(200).send({ Document_private: doc_private });
    })
}

/**
 * get all documents of a section
 * @param {*} req 
 * @param {*} res 
 */
async function getDocumentsFromSection(req, res) {
    Doc_private.find({ _id_section: req.body.sectionId }, (err, documents) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (documents.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Documents: documents })
    })
}

/**
 * get a private document
 * @param {*} req 
 * @param {*} res 
 */
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
    //case docx
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
    //case pdf (disable)
    if (docFound.extension == "pdf") {

        pdf2html.html.convertToHtml3(folder, "", -1, -1) //(folder, (err, html) => {
            // if (err) {
            //     console.error('Conversion error: ' + err)
            // } else {
            //     html = html.split("</head>")[1];
            //     html = html.replace(/\n/gi, '');
            //     html = html.replace(/\r/gi, '');
            //     return res.status(200).send({ resp: html });
            // }
            // })
    }
}

/**
 * delete document
 * @param {*} req 
 * @param {*} res 
 */
async function deleteDocument(req, res) {
    let documentId = req.body.documentId;

    Doc_private.findByIdAndRemove(documentId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ message: `document ${documentId} has been deleted` })
    })
}

async function updateDocument(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.documentId == null ||
        req.body.documentId == "" ||
        req.body.documentName == null ||
        req.body.documentName == "") {
        return res.status(500).send({ message: `Error creating the document: empty camps` })
    }

    // documentName validation 
    if (!(/^[A-Za-zÁÉÍÓÚáéíóú][A-Za-zÁÉÍÓÚáéíóú0-9 ]{2,50}$/.test(req.body.documentName))) return res.status(400).send({ message: `the document name must be between 2 and 50 characters, not contain spaces and empy start with a letter` });

    //update section
    Doc_private.findOneAndUpdate({ _id: req.body.documentId }, update, (err, document) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ Document: document })
    })

}



module.exports = {
    uploadDocPrivate,
    getDocumentsFromSection,
    getDocPrivate,
    deleteDocument,
    updateDocument
}