'use strict'

const Doc_type = require('../models/doc_type')

/**
 * new Doc_type
 * @param {*} req 
 * @param {*} res 
 */
async function newDoc_type(req, res) {
    // Check empty camps
    if (req.body.doc_typeName == null ||
        req.body.doc_typeName == "") {
        return res.status(500).send({ message: `Error creating the document type: empty camps` })
    }

    // doc_typeName validation 
    if (!(/^[A-Za-z][A-Za-z0-9 ]{2,30}$/.test(req.body.doc_typeName))) return res.status(400).send({ message: `the document type name must be between 2 and 30 characters, not contain spaces and empy start with a letter` });

    // Check duplication doc_type
    try {
        let doc_typeFound = await Doc_type.findOne({ doc_typeName: req.body.doc_typeName });
        if (doc_typeFound) {
            return res.status(400).send({ message: `the document type name: ${req.body.doc_typeName} is already registered` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Save doc_type
    let doc_type = new Doc_type({
        doc_typeName: req.body.doc_typeName,
    })

    doc_type.save((err, doc_type) => {
        if (err) res.status(500).send({ message: `Error creating document type: ${err}` })

        return res.status(200).send({ Doc_type: doc_type });
    })
}

/**
 * get all doc_types
 * @param {*} req 
 * @param {*} res 
 */
async function getDoc_types(req, res) {
    Doc_type.find({}, (err, doc_types) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (doc_types.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Doc_types: doc_types })
    })
}

/**
 * delete doc_type
 * @param {*} req 
 * @param {*} res 
 */
function deleteDoc_type(req, res) {
    let doc_typeId = req.body.doc_typeId;
    Doc_type.findByIdAndRemove(doc_typeId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ message: `document type ${doc_typeId} has been deleted` })
    })
}

/**
 * update doc_type, no case sensitive
 * @param {*} req 
 * @param {*} res 
 */
async function updateDoc_type(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.doc_typeId == null ||
        req.body.doc_typeId == "" ||
        req.body.doc_typeName == null ||
        req.body.doc_typeName == "") {
        return res.status(500).send({ message: `Error updating the document type: empty camps` })
    }

    // doc_typeName validation 
    if (!(/^[A-Za-z][A-Za-z0-9 ]{2,30}$/.test(req.body.doc_typeName))) return res.status(400).send({ message: `the document type name must be between 2 and 30 characters, not contain spaces and empy start with a letter` });

    // Check duplication doc_type
    try {
        let doc_typeFound = await Doc_type.findOne({ doc_typeName: req.body.doc_typeName });
        if (doc_typeFound) {
            return res.status(400).send({ message: `the cocument type name: ${req.body.doc_typeName} is already registered` });
        }

        Doc_type.findOneAndUpdate({ _id: req.body.doc_typeId }, update, (err, doc_type) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
            res.status(200).send({ Doc_type: doc_type })
        })
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }
}

module.exports = {
    newDoc_type,
    getDoc_types,
    deleteDoc_type,
    updateDoc_type
}