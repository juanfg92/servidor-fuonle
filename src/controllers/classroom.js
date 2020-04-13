'use strict'

const Classroom = require('../models/classroom')
const Section = require('../models/section')
const Doc_private = require('../models/document_private')
const Comment = require('../models/comment')
const path = require("path");
const fs = require("fs");
var rimraf = require("rimraf");

/**
 * add new classroom
 * @param {*} req 
 * @param {*} res 
 */
async function newClassroom(req, res) {
    // Check empty camps
    if (req.body._id_user == null ||
        req.body._id_user == "" ||
        req.body.classroomName == null ||
        req.body.classroomName == "" ||
        req.body.password == null ||
        req.body.password == "") {
        return res.status(500).send({ message: `Error creating the class room: empty camps` })
    }

    // classroom validation 
    if (!(/^[A-Za-z][A-Za-z0-9 ]{2,24}$/.test(req.body.classroomName))) return res.status(400).send({ message: `the class room name must be between 2 and 25 characters, not contain spaces and empy start with a letter` });

    // Password validation between 4 and 10 characters
    if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
        message: `the password must be between 4 and 10 characters`
    });

    // Check duplication classroomName
    try {
        let exp = new RegExp(req.body.classroomName, 'i');
        let classroomNameFound = await Classroom.findOne({ classroomName: { $regex: exp } });
        if (classroomNameFound) {
            return res.status(400).send({ message: `the class room name: ${req.body.classroomName} is already registered` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Save classroom
    let classroom = new Classroom({
        _id_user: req.body._id_user,
        password: req.body.password,
        classroomName: req.body.classroomName,
        administrators: { admin: req.body._id_user }
    })

    classroom.avatar = classroom.gravatar();

    classroom.save((err, classroom) => {
        if (err) res.status(500).send({ message: `Error creating the class room: ${err}` })
            //create folder of classroom
        let folder = path.resolve(__dirname + "/../../classroom/" + classroom._id);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        return res.status(200).send({ classroom: classroom });
    })
}

/**
 * get all classrooms
 * @param {*} req 
 * @param {*} res 
 */
async function getClassrooms(req, res) {
    Classroom.find({}, (err, classrooms) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (classrooms.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ classrooms: classrooms })
    })
}

/**
 * get classroom  by classroomName
 * @param {} req 
 * @param {*} res 
 */
async function getClassroomsByClassroomName(req, res) {
    let classroomName = req.body.classroomName;
    let exp = new RegExp(classroomName, 'i');
    Classroom.find({ classroomName: { $regex: exp } }, (err, classrooms) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (classrooms.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ classrooms: classrooms })
    })
}

/**
 * get classroom by id
 * @param {*} req 
 * @param {*} res 
 */
async function getClassroomById(req, res) {
    let classroomId = req.body.classroomId;
    Classroom.findById(classroomId, (err, classroom) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (classroom.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ classroom: classroom })
    })
}

/**
 * delete classroom
 * @param {*} req 
 * @param {*} res 
 */
function deleteClassroom(req, res) {
    let classroomId = req.body.classroomId;
    Classroom.findByIdAndRemove(classroomId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        //remove all sections, documents and comments contained in this classroom
        Section.deleteMany({ _id_classroom: classroomId }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })
        Doc_private.deleteMany({ _id_classroom: classroomId }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })
        Comment.deleteMany({ _id_classroom: classroomId }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })

        //remove all containers from the classroom
        let pathFile = path.resolve(__dirname + "/../../classroom/" + req.body.classroomId)
        rimraf.sync(pathFile);

        res.status(200).send({ message: `class room ${classroomId} has been deleted` })
    })
}

/**
 * update classroom
 * @param {*} req 
 * @param {*} res 
 */
async function updateClassroom(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.classroomId == null ||
        req.body.classroomId == "" ||
        req.body.password == null ||
        req.body.password == "" ||
        req.body.classroomName == null ||
        req.body.classroomName == "") {
        return res.status(500).send({ message: `Error updating the class room: empty camps` })
    }

    // Password validation between 4 and 10 characters
    if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
        message: `the password must be between 4 and 10 characters`
    });

    // classroom validation 
    if (!(/^[A-Za-z][A-Za-z0-9 ]{2,24}$/.test(req.body.classroomName))) return res.status(400).send({ message: `the class room name must be between 2 and 25 characters, not contain spaces and empy start with a letter` });

    // Check duplication classroomName
    try {
        let exp = new RegExp(req.body.classroomName, 'i');
        let classroomFound = await Classroom.findOne({ classroomName: { $regex: exp } });

        if (classroomFound) {
            if (classroomFound._id != req.body.classroomId) {
                return res.status(400).send({ message: `the class room name: ${req.body.classroomName} is already registered` });
            }
        }
        //update classroom
        Classroom.findOneAndUpdate(req.body.classroomId, update, (err, classroom) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
            res.status(200).send({ Classroom: classroom })
        })
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }
}

module.exports = {
    newClassroom,
    getClassrooms,
    getClassroomsByClassroomName,
    getClassroomById,
    deleteClassroom,
    updateClassroom
}