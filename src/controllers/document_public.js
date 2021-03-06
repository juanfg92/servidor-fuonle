'use strict'

const Doc_public = require('../models/document_public')
const User = require('../models/user')
const UserController = require('../controllers/user')
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
async function uploadDocPublic(req, res) {
    // Check empty camps
    if (req.body.studyLevelId == null ||
        req.body.studyLevelId == "" ||
        req.body.doc_typeId == null ||
        req.body.doc_typeId == "" ||
        req.body.userId == null ||
        req.body.userId == "" ||
        req.body.documentName == null ||
        req.body.documentName == "" ||
        req.body.description == null ||
        req.body.description == "" ||
        req.files.file == undefined) {
        return res.status(500).send({ message: `Error creating the document: empty camps` })
    }

    // documentName validation 
    if (!(parameters.expReg.docPublicName.test(req.body.documentName))) return res.status(400).send({ message: parameters.errMessage.docPublicName });

    // description validation 
    if (!(parameters.expReg.docPublicDescription.test(req.body.description))) return res.status(400).send({ message: parameters.errMessage.docPublicDescription });


    //get extension
    let spl = req.files.file.name.split(".");
    let ext = spl[spl.length - 1]

    //extension validation
    if (!(/^(pdf)$/.test(ext))) return res.status(400).send({ message: `the document extension must be (.pdf)` });

    // Save document
    let doc_public;
    if (req.body.subcategoryId != "null") {
        doc_public = new Doc_public({
            _id_studyLevel: req.body.studyLevelId,
            _id_category: req.body.categoryId,
            _id_subcategory: req.body.subcategoryId,
            _id_user: req.body.userId,
            _id_doc_type: req.body.doc_typeId,
            documentName: req.body.documentName,
            description: req.body.description,
            extension: ext,
        })
    }
    if (req.body.categoryId && req.body.subcategoryId == "null") {
        doc_public = new Doc_public({
            _id_studyLevel: req.body.studyLevelId,
            _id_category: req.body.categoryId,
            _id_subcategory: null,
            _id_user: req.body.userId,
            _id_doc_type: req.body.doc_typeId,
            documentName: req.body.documentName,
            description: req.body.description,
            extension: ext,
        })
    }
    if (req.body.categoryId == "null" && req.body.subcategoryId == "null") {
        doc_public = new Doc_public({
            _id_studyLevel: req.body.studyLevelId,
            _id_category: null,
            _id_subcategory: null,
            _id_user: req.body.userId,
            _id_doc_type: req.body.doc_typeId,
            documentName: req.body.documentName,
            description: req.body.description,
            extension: ext,
        })
    }


    //save document
    doc_public.save((err, doc_public) => {
        if (err) res.status(500).send({ message: `Error creating the document: ${err}` })

        //upload file and move to section folder
        let EDFile = req.files.file
        let folder

        // route document
        if (doc_public._id_subcategory != null) {
            folder = path.resolve(__dirname + "/../../public_document/" + doc_public._id_studyLevel + "/" + doc_public._id_category + "/" + doc_public._id_subcategory + "/" + doc_public._id + "." + doc_public.extension);
        }
        if (doc_public._id_subcategory == null && doc_public._id_category) {
            folder = path.resolve(__dirname + "/../../public_document/" + doc_public._id_studyLevel + "/" + doc_public._id_category + "/" + doc_public._id + "." + doc_public.extension);
        }
        if (doc_public._id_subcategory == null && doc_public._id_category == null) { //case pre-primaria, dont have categories and subcategories
            folder = path.resolve(__dirname + "/../../public_document/" + doc_public._id_studyLevel + "/" + doc_public._id + "." + doc_public.extension);
        }
        EDFile.mv(folder, err => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            return res.status(200).send({ Document_public: doc_public });
        })

    })
}

/**
 * get all documents
 * @param {*} req 
 * @param {*} res 
 */
async function getDocsPublic(req, res) {
    let coincidences = []
    let folder
    let docFound

    //find documents
    try {
        docFound = await Doc_public.find({});
        if (docFound.length == 0) {
            return res.status(400).send({ message: `no results have been obtained` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }
    docFound.forEach(doc => {
        // route document
        if (doc.categoryId) {
            folder = path.resolve(__dirname + "/../../public_document/" + doc.studyLevelId + "/" + doc.categoryId + "/" + doc.subcategoryId + "/" + doc._id);
        } else { //case pre-primaria, dont have categories and subcategories
            folder = path.resolve(__dirname + "/../../public_document/" + doc.studyLevelId + "/" + doc._id);
        }

        coincidences.push(doc)
    });
    return res.status(200).send({ Documents: coincidences });
}

/**
 * get documents by filter
 * @param {*} req 
 * @param {*} res 
 */
async function getDocsPublicByFilter(req, res) {
    let coincidences = []
    let folder
    let docFound
    let documentName = req.body.documentName == "null" ? "" : req.body.documentName
    let studyLevelId = req.body.studyLevelId == "null" ? false : req.body.studyLevelId
    let categoryId = req.body.categoryId == "null" ? false : req.body.categoryId
    let subcategoryId = req.body.subcategoryId == "null" ? false : req.body.subcategoryId
    let doc_type = req.body.doc_typeId == "null" ? false : req.body.doc_typeId

    //find documents
    try {
        let exp = new RegExp(documentName, 'i')
        if (!categoryId && !doc_type) {
            docFound = await Doc_public.find({ _id_studyLevel: studyLevelId, documentName: { $regex: exp } })
        }
        if (categoryId && !subcategoryId && !doc_type) {
            docFound = await Doc_public.find({ _id_studyLevel: studyLevelId, _id_category: categoryId, documentName: { $regex: exp } })
        }
        if (subcategoryId && !doc_type) {
            docFound = await Doc_public.find({
                _id_studyLevel: studyLevelId,
                _id_category: categoryId,
                _id_subcategory: subcategoryId,
                documentName: { $regex: exp }
            })
        }
        if (!categoryId && doc_type) {
            docFound = await Doc_public.find({ _id_studyLevel: studyLevelId, _id_doc_type: doc_type, documentName: { $regex: exp } })
        }
        if (categoryId && !subcategoryId && doc_type) {
            docFound = await Doc_public.find({
                _id_studyLevel: studyLevelId,
                _id_category: categoryId,
                _id_doc_type: doc_type,
                documentName: { $regex: exp }
            })
        }
        if (subcategoryId && doc_type) {
            docFound = await Doc_public.find({
                _id_studyLevel: studyLevelId,
                _id_category: categoryId,
                _id_subcategory: subcategoryId,
                _id_doc_type: doc_type,
                documentName: { $regex: exp }
            })
        }

        if (docFound.length == 0) {
            return res.status(200).send(false);
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }
    //push all doc coincidences and send resp
    docFound.forEach(doc => {
        coincidences.push(doc)
    });
    return res.status(200).send(coincidences);
}

/**
 * get document by id
 * @param {*} req 
 * @param {*} res 
 */
async function getPublicDocById(req, res) {
    Doc_public.findById({ _id: req.body.docId }, (err, doc) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        return res.status(200).send(doc)
    })
}

/**
 * get doc by id
 * @param {*} req 
 * @param {*} res 
 */
async function getPublicDocByUserId(req, res) {
    Doc_public.find({ _id_user: req.body.userId }, (err, docs) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (docs) {
            return res.status(200).send(docs)
        }
        return res.status(200).send(false)
    })
}

/**
 * send document by id
 * @param {*} req 
 * @param {*} res 
 */
async function sendDocument(req, res) {
    let folder
    let docFound
        //find documents
    try {
        docFound = await Doc_public.findOne({ _id: req.params.docid });

        if (!docFound) {
            return res.status(400).send({ message: `no results have been obtained` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    if (docFound) {
        if (docFound._id_subcategory) {
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id_category + "/" + docFound._id_subcategory + "/" + docFound._id + "." + docFound.extension);
        }
        if (docFound._id_category && !docFound._id_subcategory) {
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id_category + "/" + docFound._id + "." + docFound.extension);
        }
        if (!docFound._id_category && !docFound._id_subcategory) { //case pre-primaria, dont have categories and subcategories
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id + "." + docFound.extension);
        }
        return res.status(200).sendFile(folder)
    } else {
        return res.status(400).send({ message: `Error server` })
    }

}

/**
 * delete document
 * @param {*} req 
 * @param {*} res 
 */
async function deleteDocument(req, res) {
    let documentId = req.params.docid;
    let folder
    let docFound = await Doc_public.findOne({ _id: documentId });

    Doc_public.findByIdAndRemove(documentId, (err) => {
        if (err) {
            return res.status(500).send({ message: `Error server: ${err}` })
        }

        //remove document from folder
        if (docFound._id_subcategory) {
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id_category + "/" + docFound._id_subcategory + "/" + docFound._id + "." + docFound.extension);
        }
        if (docFound._id_category && !docFound._id_subcategory) {
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id_category + "/" + docFound._id + "." + docFound.extension);
        }
        if (!docFound._id_category && !docFound._id_subcategory) { //case pre-primaria, dont have categories and subcategories
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id + "." + docFound.extension);
        }

        fs.unlink(folder, (err) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
        })

        //We search for all users who have this document as a favorite and delete it
        User.find({ _id_docs_favorites: { "$in": [documentId] } }, (err, users) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
            if (users) {
                users.forEach(user => {
                    User.findOne({ _id: user._id }, (err, user) => {
                        if (err) return res.status(500).send(err)
                        let index = user._id_docs_favorites.indexOf(documentId);
                        if (index > -1) {
                            user._id_docs_favorites.splice(index, 1);
                            User.findOneAndUpdate({ _id: user._id }, user, (err, user) => {
                                if (err) return res.status(500).send(false)
                            })
                        }
                    })
                });
            }
        });

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
        req.body.documentName == "" ||
        req.body.description == null ||
        req.body.description == "") {
        return res.status(500).send({ message: `Error updating the document: empty camps` })
    }

    // documentName validation 
    if (!(parameters.expReg.docPublicName.test(req.body.documentName))) return res.status(400).send({ message: parameters.errMessage.docPublicName });

    // description validation 
    if (!(parameters.expReg.docPublicDescription.test(req.body.description))) return res.status(400).send({ message: parameters.errMessage.docPublicDescription });

    //update section
    Doc_public.findOneAndUpdate({ _id: req.body.documentId }, update, (err, document) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ Document: document })
    })
}

module.exports = {
    uploadDocPublic,
    getDocsPublic,
    getDocsPublicByFilter,
    sendDocument,
    deleteDocument,
    updateDocument,
    getPublicDocById,
    getPublicDocByUserId
}