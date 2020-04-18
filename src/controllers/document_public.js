'use strict'

const Doc_public = require('../models/document_public')
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
        req.body.categoryId == null ||
        req.body.categoryId == "" ||
        req.body.subcategoryId == null ||
        req.body.subcategoryId == "" ||
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
    if (!(/^[A-Za-zÁÉÍÓÚáéíóú][A-Za-zÁÉÍÓÚáéíóú0-9 ]{2,50}$/.test(req.body.documentName))) return res.status(400).send({ message: `the document name must be between 2 and 50 characters, not empty spaces and empy start with a letter` });

    // description validation 
    if (!(/^[A-Za-zÁÉÍÓÚáéíóú][A-Za-zÁÉÍÓÚáéíóú0-9 /*-+,.-_!"'^`{}<>ºª%&()]{2,128}$/.test(req.body.description))) return res.status(400).send({ message: `the description must be between 2 and 128 characters, not empty spaces and empy start with a letter` });


    //get extension
    let spl = req.files.file.name.split(".");
    let ext = spl[spl.length - 1]

    //extension validation
    if (!(/^(docx)$/.test(ext))) return res.status(400).send({ message: `the document extension must be .docx` });

    // Save document
    let doc_public = new Doc_public({
        _id_studyLevel: req.body.studyLevelId,
        _id_category: req.body.categoryId,
        _id_subcategory: req.body.subcategoryId,
        _id_user: req.body.userId,
        _id_doc_type: req.body.doc_typeId,
        documentName: req.body.documentName,
        description: req.body.description,
        extension: ext,
    })

    //save document
    doc_public.save((err, doc_public) => {
        if (err) res.status(500).send({ message: `Error creating the comment: ${err}` })

        //upload file and move to section folder
        let EDFile = req.files.file
        let folder = path.resolve(__dirname + "/../../private_document/" + req.body.studyLevelId + "/" + req.body.categoryId + "/" + req.body.subcategoryId + "/" + doc_public._id);

        EDFile.mv(folder, err => {
            if (err) return res.status(500).send({ message: err })
        })
        return res.status(200).send({ Document_public: doc_public });
    })
}

/**
 * get all public documents
 * @param {*} req 
 * @param {*} res 
 */
async function getDocsPublic(req, res) {
    let docFound = []
    let docsSend = []
    let folder

    //find document
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
            folder = path.resolve(__dirname + "/../../private_document/" + doc.studyLevelId + "/" + doc.categoryId + "/" + doc.subcategoryId + "/" + doc._id + "." + doc.extension);
        } else { //case pre-primaria, dont have categories and subcategories
            folder = path.resolve(__dirname + "/../../private_document/" + doc.studyLevelId + "/" + doc._id + "." + doc.extension);
        }
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
                    docsSend.push(html)
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
    });
    return res.status(200).send({ resp: html });
}