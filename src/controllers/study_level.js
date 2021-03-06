'use strict'

const StudyLevel = require('../models/study_level')
const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const parameters = require('../../parameters')
const path = require("path");
const fs = require("fs");
var rimraf = require("rimraf");

/**
 * new studyLevel
 * @param {*} req 
 * @param {*} res 
 */
async function newStudyLevel(req, res) {
    // Check empty camps
    if (req.body.studyLevelName == null ||
        req.body.studyLevelName == "") {
        return res.status(500).send({ message: `Error creating the study level: empty camps` })
    }

    // studyLevelName validation 
    if (!(parameters.expReg.studyLevelName.test(req.body.studyLevelName))) return res.status(400).send({ message: parameters.errMessage.studyLevelName });

    // Check duplication studyLevel
    try {
        let studyLevelFound = await StudyLevel.findOne({ studyLevelName: req.body.studyLevelName });
        if (studyLevelFound) {
            return res.status(400).send({ message: `the study level name: ${req.body.studyLevelName} is already registered` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Save studyLevel
    let studyLevel = new StudyLevel({
        studyLevelName: req.body.studyLevelName,
    })

    studyLevel.save((err, studyLevel) => {
        if (err) res.status(500).send({ message: `Error creating study level: ${err}` })
            //create study level folder
        let folder = path.resolve(__dirname + "/../../public_document/" + studyLevel._id);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        return res.status(200).send({ StudyLevel: studyLevel });
    })
}

/**
 * get all studyLevels
 * @param {*} req 
 * @param {*} res 
 */
async function getStudyLevels(req, res) {
    StudyLevel.find({}, (err, studyLevel) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (studyLevel.length == 0) return res.status(404).send(false)
        res.status(200).send(studyLevel)
    })
}

/**
 * delete study level and all categories and subcategories contained
 * @param {*} req 
 * @param {*} res 
 */
function deleteStudyLevel(req, res) {
    let studyLevelId = req.body.studyLevelId;
    StudyLevel.findByIdAndRemove(studyLevelId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        //remove all categories and subcategories contained in this studyLevel
        Category.deleteMany({ _id_studyLevel: studyLevelId }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })
        Subcategory.deleteMany({ _id_studyLevel: studyLevelId }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })

        //remove all containers from the studyLevel
        let pathFile = path.resolve(__dirname + "/../../public_document/" + req.body.studyLevelId)
        rimraf.sync(pathFile);
        res.status(200).send({ message: `study level ${studyLevelId} has been deleted` })
    })
}

/**
 * update study level, no case sensitive
 * @param {*} req 
 * @param {*} res 
 */
async function updateStudyLevel(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.studyLevelName == null ||
        req.body.studyLevelName == "") {
        return res.status(500).send({ message: `Error updating the study level: empty camps` })
    }

    // studyLevelName validation 
    if (!(parameters.expReg.studyLevelName.test(req.body.studyLevelName))) return res.status(400).send({ message: parameters.errMessage.studyLevelName });

    // Check duplication studyLevel
    try {
        let studyLevelFound = await StudyLevel.findOne({ studyLevelName: req.body.studyLevelName });
        if (studyLevelFound) {
            return res.status(400).send({ message: `the study level name: ${req.body.studyLevelName} is already registered` });
        }
        StudyLevel.findOneAndUpdate(req.body.studyLevelId, update, (err, studyLevel) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
            res.status(200).send({ StudyLevel: studyLevel })
        })
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }
}

module.exports = {
    newStudyLevel,
    getStudyLevels,
    deleteStudyLevel,
    updateStudyLevel
}