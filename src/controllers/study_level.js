'use strict'

const StudyLevel = require('../models/study_level')
const Category = require('../models/category')
const Subcategory = require('../models/subcategory')


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
    if (!(/^[A-Za-zÁÉÍÓÚáéíóú][A-Za-zÁÉÍÓÚáéíóú0-9 ]{2,20}$/.test(req.body.studyLevelName))) return res.status(400).send({ message: `the study level name must be between 2 and 20 characters, not contain spaces and empy start with a letter` });

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
        if (studyLevel.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ StudyLevels: studyLevel })
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
    if (!(/^[A-Za-zÁÉÍÓÚáéíóú][A-Za-zÁÉÍÓÚáéíóú0-9 ]{2,20}$/.test(req.body.studyLevelName))) return res.status(400).send({ message: `the study level name must be between 2 and 20 characters, not contain spaces and empy start with a letter` });

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