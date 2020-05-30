'use strict'

const Doc_private = require('../models/document_private')
const parameters = require('../../parameters')
const path = require("path")
const fs = require("fs")
const mammoth = require("mammoth")
const pdf2html = require("pdf2html")

/**
 * upload file (.docx|.pdf)
 * @param {*} req 
 * @param {*} res 
 */
function uploadDocPrivate(req, res) {
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
    if (!(parameters.expReg.docPrivateName.test(req.body.documentName))) return res.status(400).send(parameters.errMessage.docPrivateName);

    //get extension
    let spl = req.files.file.name.split(".");
    let ext = spl[spl.length - 1]

    //create name document
    var name = "";
    for (let index = 0; index < spl.length - 1; index++) {
        if (index == 0) {
            name += spl[index]
        } else {
            name += " " + spl[index]
        }
    }

    //extension validation
    if (!(/^(pdf)$/.test(ext))) return res.status(400).send({ message: `the document extension must be (.pdf)` });

    // Save document
    let doc_private = new Doc_private({
        _id_classroom: req.body.classroomId,
        _id_section: req.body.sectionId,
        _id_user: req.body.userId,
        extension: ext,
        documentName: name
    })

    //save document
    doc_private.save((err, doc_private) => {
        if (err) return res.status(500).send({ message: `Error creating the comment: ${err}` })

        let EDFile = req.files.file
        let folder = path.resolve(__dirname + "/../../classroom/" + req.body.classroomId + "/" + req.body.sectionId + "/" + doc_private._id + "." + ext);

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
        if (documents.length == 0) return res.status(200).send(false)
        res.status(200).send(documents)
    })
}

/**
 * get a private document
 * @param {*} req 
 * @param {*} res 
 */
async function sendDocPrivate(req, res) {
    let documentId = req.params.docid
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
    return res.status(200).sendFile(folder)
}

/**
 * delete document
 * @param {*} req 
 * @param {*} res 
 */
async function deleteDocument(req, res) {
    let documentId = req.params.docid;

    let docFound = await Doc_private.findOne({ _id: documentId });

    Doc_private.findByIdAndRemove({ _id: documentId }, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }

        //remove document from folder
        let folder = path.resolve(__dirname + "/../../classroom/" + docFound._id_classroom + "/" + docFound._id_section + "/" + docFound._id + "." + docFound.extension);

        fs.unlink(folder, (err) => {
                if (err) {
                    return res.status(500).send({ message: `Error server: ${err}` })
                }
            }) //{ message: `document ${documentId} has been deleted` }
        return res.status(200).send(true)
    })
}

/**
 * update document
 * @param {*} req 
 * @param {*} res 
 */
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
    if (!(parameters.expReg.docPrivateName.test(req.body.documentName))) return res.status(400).send({ message: parameters.errMessage.docPrivateName });

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
    sendDocPrivate,
    deleteDocument,
    updateDocument
}