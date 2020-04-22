'use strict'

const Doc_public = require('../models/document_public')
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
    if (!(/^(docx|doc|pdf)$/.test(ext))) return res.status(400).send({ message: `the document extension must be (.docx|.doc|.pdf)` });

    // Save document
    let doc_public;
    if (req.body.categoryId) {
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
    } else {
        doc_public = new Doc_public({
            _id_studyLevel: req.body.studyLevelId,
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
        if (doc_public._id_category) {
            folder = path.resolve(__dirname + "/../../public_document/" + doc_public._id_studyLevel + "/" + doc_public._id_category + "/" + doc_public._id_subcategory + "/" + doc_public._id);
        } else { //case pre-primaria, dont have categories and subcategories
            folder = path.resolve(__dirname + "/../../public_document/" + doc_public._id_studyLevel + "/" + doc_public._id);
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
    let documentName = req.body.documentName
    let studyLevelId = req.body.studyLevelId
    let categoryId = req.body.categoryId
    let subcategoryId = req.body.subcategoryId
    let doc_type = req.body.doc_typeId

    //find documents
    try {
        let exp = new RegExp(documentName, 'i')
        if (!categoryId && !doc_type) {
            docFound = await Doc_public.find({ _id_studyLevel: studyLevelId, documentName: { $regex: exp } })
        } else if (categoryId && !subcategoryId && !doc_type) {
            docFound = await Doc_public.find({ _id_studyLevel: studyLevelId, _id_category: categoryId, documentName: { $regex: exp } })
        } else if (subcategoryId && !doc_type) {
            docFound = await Doc_public.find({
                _id_studyLevel: studyLevelId,
                _id_category: categoryId,
                _id_subcategory: subcategoryId,
                documentName: { $regex: exp }
            })
        } else if (!categoryId && doc_type) {
            docFound = await Doc_public.find({ _id_studyLevel: studyLevelId, _id_doc_type: req.body.doc_typeId, documentName: { $regex: exp } })
        } else if (categoryId && !subcategoryId && doc_type) {
            docFound = await Doc_public.find({
                _id_studyLevel: studyLevelId,
                _id_category: categoryId,
                _id_doc_type: req.body.doc_typeId,
                documentName: { $regex: exp }
            })
        } else if (subcategoryId && doc_type) {
            docFound = await Doc_public.find({
                _id_studyLevel: studyLevelId,
                _id_category: categoryId,
                _id_subcategory: subcategoryId,
                _id_doc_type: req.body.doc_typeId,
                documentName: { $regex: exp }
            })
        }

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
    return res.status(200).send({ Coincidences: coincidences });
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
        docFound = await Doc_public.findOne({ _id: req.body.documentId });

        if (!docFound) {
            return res.status(400).send({ message: `no results have been obtained` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    if (docFound) {
        if (docFound._id_category) {
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id_category + "/" + docFound._id_subcategory + "/" + docFound._id);
        } else { //case pre-primaria, dont have categories and subcategories
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id);
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
    let documentId = req.body.documentId;
    let folder
    let docFound = await Doc_public.findOne({ _id: documentId });

    Doc_public.findByIdAndRemove(documentId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }

        //remove document from folder
        if (docFound._id_category) {
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id_category + "/" + docFound._id_subcategory + "/" + docFound._id);
        } else { //case pre-primaria, dont have categories and subcategories
            folder = path.resolve(__dirname + "/../../public_document/" + docFound._id_studyLevel + "/" + docFound._id);
        }

        fs.unlink(folder, (err) => {
            if (err) {
                return res.status(500).send({ message: `Error server: ${err}` })
            }
        })
        res.status(200).send({ message: `document ${documentId} has been deleted` })
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
    updateDocument
}










































// //case docx
// if (docFound.extension == "docx") {
//     var options = {
//         styleMap: [
//             "b => strong",
//             "i => i",
//             "u => u",
//             "p[style-name='Section Title'] => h1:fresh",
//             "p[style-name='Subsection Title'] => h2:fresh"
//         ],
//         convertImage: mammoth.images.imgElement(function(image) {
//             return image.read("base64").then(function(imageBuffer) {
//                 return {
//                     src: "data:" + image.contentType + ";base64," + imageBuffer
//                 };
//             });
//         })
//     };
//     mammoth.convertToHtml({ path: folder }, options)
//         .then(function(result) {
//             var html = result.value; // The generated HTML
//             var messages = result.messages; // Any messages, such as warnings during conversion
//             docsSend.push(html)
//         })
//         .done();
// }
// //case pdf (disable)
// if (docFound.extension == "pdf") {

//     pdf2html.html.convertToHtml3(folder, "", -1, -1) //(folder, (err, html) => {
//         // if (err) {
//         //     console.error('Conversion error: ' + err)
//         // } else {
//         //     html = html.split("</head>")[1];
//         //     html = html.replace(/\n/gi, '');
//         //     html = html.replace(/\r/gi, '');
//         //     return res.status(200).send({ resp: html });
//         // }
//         // })
// }