'use strict'

const Section = require('../models/section')
const Doc_private = require('../models/document_private')
const Comment = require('../models/comment')
const parameters = require('../../parameters')
const path = require("path");
const fs = require("fs");
var rimraf = require("rimraf");

/**
 * new section
 * @param {*} req 
 * @param {*} res 
 */
async function newSection(req, res) {
    // Check empty camps
    if (req.body.classroomId == null ||
        req.body.classroomId == "" ||
        req.body.sectionName == null ||
        req.body.sectionName == "") {
        return res.status(500).send({ message: `Error creating the section: empty camps` })
    }

    // section validation 
    if (!(parameters.expReg.sectionName.test(req.body.sectionName))) return res.status(400).send({ message: parameters.errMessage.sectionName });

    // Check duplication sectionName
    try {
        let exp = new RegExp(req.body.sectionName, 'i');
        let sectionNameFound = await Section.findOne({ _id_classroom: req.body.classroomId, sectionName: { $regex: exp } });
        if (sectionNameFound) { //{ message: `the section name: ${req.body.sectionName} is already registered` }
            return res.status(200).send(false);
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Save section
    let section = new Section({
        _id_classroom: req.body.classroomId,
        sectionName: req.body.sectionName,
    })

    section.save((err, section) => {
        if (err) res.status(500).send({ message: `Error creating the section: ${err}` })
            //create folder of section
        let folder = path.resolve(__dirname + "/../../classroom/" + req.body.classroomId + "/" + section._id);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        return res.status(200).send(true);
    })
}

/**
 * get sections of a classroom
 * @param {*} req 
 * @param {*} res 
 */
async function getSectionFromClassroom(req, res) {
    Section.find({ _id_classroom: req.body.classroomId }, (err, sections) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (sections.length == 0) return res.status(200).send(false)
        return res.status(200).send(sections)
    })
}

/**
 * get section by id
 * @param {*} req 
 * @param {*} res 
 */
async function getSectionById(req, res) {
    let sectionId = req.body.sectionId;
    Section.findById({ _id: sectionId }, (err, section) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (!section) return res.status(200).send(false)
        return res.status(200).send(section)
    })
}

function deleteSection(req, res) {
    let sectionId = req.params.sectionid;
    let classroomId = req.params.classroomid
    Section.findByIdAndRemove({ _id: sectionId }, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        //remove all documents and comments contained in this section
        Doc_private.deleteMany({ _id_section: sectionId }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })
        Comment.deleteMany({ _id_section: sectionId }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })

        //remove all containers from the section
        let pathFile = path.resolve(__dirname + "/../../classroom/" + classroomId + "/" + sectionId)
        rimraf.sync(pathFile);
        // { message: `section ${sectionId} has been deleted` }
        return res.status(200).send(true)
    })
}

/**
 * update section
 * @param {*} req 
 * @param {*} res 
 */
async function updateSection(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.sectionId == null ||
        req.body.sectionId == "" ||
        req.body.sectionName == null ||
        req.body.sectionName == "" ||
        req.body.classroomId == null ||
        req.body.classroomId == "") {
        return res.status(500).send({ message: `Error updating the section: empty camps` })
    }

    // section validation 
    if (!(parameters.expReg.sectionName.test(req.body.sectionName))) return res.status(400).send({ message: parameters.errMessage.sectionName });

    // Check duplication section
    // try {
    // let exp = new RegExp(req.body.sectionName, 'i');
    // let sectionFound = await Section.findOne({ _id_classroom: req.body.classroomId, sectionName: { $regex: exp } });

    // if (req.body.sectionName == sectionFound.sectionName) res.status(200).send(true)

    // if (sectionFound) { //{ message: `the section name: ${req.body.sectionName} is already registered` }
    // return res.status(200).send(false);
    // }
    //update section
    Section.findOneAndUpdate({ _id: req.body.sectionId }, update, (err, section) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })

            return res.status(200).send(true)
        })
        // } catch (err) {
        // return res.status(500).send({ message: `Error server: ${err}` });
        // }
}

module.exports = {
    newSection,
    getSectionFromClassroom,
    getSectionById,
    deleteSection,
    updateSection
}