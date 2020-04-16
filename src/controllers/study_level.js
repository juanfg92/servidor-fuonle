'use strict'

const StudyLevel = require('../models/study_level')

/**
 * new studyLevel
 * @param {*} req 
 * @param {*} res 
 */
async function newStudyLevel(req, res) {
    // Check empty camps
    if (req.body.studyLevelName == null ||
        req.body._id_user == "") {
        return res.status(500).send({ message: `Error creating the class room: empty camps` })
    }

    // studyLevelName validation 
    if (!(/^[A-Za-z][A-Za-z0-9 ]{2,20}$/.test(req.body.classroomName))) return res.status(400).send({ message: `the class room name must be between 2 and 20 characters, not contain spaces and empy start with a letter` });

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

module.exports = {
    newStudyLevel,
    getStudyLevels
}