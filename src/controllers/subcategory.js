'use strict'

const Subcategory = require('../models/subcategory')
const path = require("path");
const fs = require("fs");
var rimraf = require("rimraf");

/**
 * new subcategory
 * @param {*} req 
 * @param {*} res 
 */
async function newSubcategory(req, res) {
    // Check empty camps
    if (req.body.subcategoryName == null ||
        req.body.subcategoryName == "" ||
        req.body.studyLevelId == null ||
        req.body.studyLevelId == "" ||
        req.body.categoryId == null ||
        req.body.categoryId == "") {
        return res.status(500).send({ message: `Error creating the subcategory: empty camps` })
    }

    // subcategoryName validation 
    if (!(/^[A-Za-zÁÉÍÓÚáéíóúñÑ][A-Za-zÁÉÍÓÚáéíóú0-9 -\x41\x42ñÑü.]{2,60}$/.test(req.body.subcategoryName))) return res.status(400).send({ message: `the subcategory name must be between 2 and 60 characters, not contain spaces and empy start with a letter` });

    // Check duplication subcategory
    try {
        let subcategoryFound = await Subcategory.findOne({ subcategoryName: req.body.subcategoryName, _id_studyLevel: req.body.studyLevelId, _id_category: req.body.categoryId });
        if (subcategoryFound) {
            return res.status(400).send({ message: `the subcategory name: ${req.body.subcategoryName} is already registered` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Save category
    let subcategory = new Subcategory({
        subcategoryName: req.body.subcategoryName,
        _id_studyLevel: req.body.studyLevelId,
        _id_category: req.body.categoryId
    })

    subcategory.save((err, subcategory) => {
        if (err) res.status(500).send({ message: `Error creating subcategory: ${err}` })

        //create subcategory folder
        let folder = path.resolve(__dirname + "/../../private_document/" + req.body.studyLevelId + "/" + req.body.categoryId + "/" + subcategory._id);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        return res.status(200).send({ Subcategory: subcategory });
    })
}

/**
 * get all subcategories by studyLevelId and categoryId
 * @param {*} req 
 * @param {*} res 
 */
async function getSubcategoriesByStudyLevelAndCategoryId(req, res) {
    Subcategory.find({ _id_studyLevel: req.body.studyLevelId, _id_category: req.body.categoryId }, (err, subcategories) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (subcategories.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Subcategories: subcategories })
    })
}

/**
 * delete subcategory
 * @param {*} req 
 * @param {*} res 
 */
function deleteSubcategory(req, res) {
    let subcategoryId = req.body.subcategoryId;
    Subcategory.findByIdAndRemove(subcategoryId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }

        //remove all containers from the subcategory
        let pathFile = path.resolve(__dirname + "/../../private_document/" + req.body.studyLevelId + "/" + req.body.categoryId + "/" + req.body.subcategoryId)
        rimraf.sync(pathFile);

        res.status(200).send({ message: `subcategory ${subcategoryId} has been deleted` })
    })
}

/**
 * update subcategory, no case sensitive
 * @param {*} req 
 * @param {*} res 
 */
async function updateSubcategory(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.subcategoryName == null ||
        req.body.subcategoryName == "" ||
        req.body.subcategoryId == null ||
        req.body.subcategoryId == "" ||
        req.body.categoryId == null ||
        req.body.categoryId == "" ||
        req.body.studyLevelId == null ||
        req.body.studyLevelId == "") {
        return res.status(500).send({ message: `Error updating the subcategory: empty camps` })
    }

    // subcategoryName validation 
    if (!(/^[A-Za-zÁÉÍÓÚáéíóúñÑ][A-Za-zÁÉÍÓÚáéíóú0-9 -\x41\x42ñÑü.]{2,60}$/.test(req.body.subcategoryName))) return res.status(400).send({ message: `the subcategory name must be between 2 and 60 characters, not contain spaces and empy start with a letter` });

    // Check duplication category
    try {
        let subcategoryFound = await Subcategory.findOne({ subcategoryName: req.body.subcategoryName, _id_studyLevel: req.body.studyLevelId, _id_category: req.body.categoryId });
        if (subcategoryFound) {
            return res.status(400).send({ message: `the subcategory name: ${req.body.subcategoryName} is already registered` });
        }

        Subcategory.findOneAndUpdate({ _id: req.body.subcategoryId }, update, (err, subcategory) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
            res.status(200).send({ Subcategory: subcategory })
        })
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }
}

module.exports = {
    newSubcategory,
    getSubcategoriesByStudyLevelAndCategoryId,
    deleteSubcategory,
    updateSubcategory
}