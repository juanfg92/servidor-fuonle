'use strict'

const Classroom = require('../models/classroom')
const Section = require('../models/section')
const Doc_private = require('../models/document_private')
const Comment = require('../models/comment')
const RestorePassword = require('../models/restore_password')
const User = require('../models/user')
const parameters = require('../../parameters')
const path = require("path");
const fs = require("fs");
var rimraf = require("rimraf");
const mailer = require('../services/mailer')
var generator = require('generate-password');

/**
 * add new classroom
 * @param {*} req 
 * @param {*} res 
 */
async function newClassroom(req, res) {
    // Check empty camps
    if (req.body.userId == null ||
        req.body.userId == "" ||
        req.body.classroomName == null ||
        req.body.classroomName == "" ||
        req.body.password == null ||
        req.body.password == "") {
        return res.status(500).send({ message: `Error creating the class room: empty camps` })
    }

    // classroomName validation 
    if (!(parameters.expReg.classroomName.test(req.body.classroomName))) return res.status(400).send({ message: parameters.errMessage.classroomName });

    // Password validation between 4 and 10 characters
    if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
        message: `the password must be between 4 and 10 characters`
    });

    // Check duplication classroomName
    try {
        let exp = new RegExp(req.body.classroomName, 'i');
        let classroomNameFound = await Classroom.findOne({ classroomName: { $regex: exp } });
        if (classroomNameFound) { //{ message: `the class room name: ${req.body.classroomName} is already registered` }
            return res.status(200).send(false);
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Save classroom
    let classroom = new Classroom({
        userId: req.body.userId,
        password: req.body.password,
        classroomName: req.body.classroomName,
        whiteList: req.body.userId,
        administrators: req.body.userId
    })

    classroom.avatar = classroom.gravatar();

    classroom.save((err, classroom) => {
        if (err) res.status(500).send({ message: `Error creating the class room: ${err}` })
            //create folder of classroom
        let folder = path.resolve(__dirname + "/../../classroom/" + classroom._id);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        return res.status(200).send(true);
    })
}

/**
 * add user as administrator
 * @param {*} req 
 * @param {*} res 
 */
async function addAdmin(req, res) {
    let classroom = await Classroom.findById(req.body.classroomId)
    if (classroom.administrators.indexOf(req.body.userId) == -1) {
        classroom.administrators.push(req.body.userId)

        Classroom.findOneAndUpdate({ _id: req.body.classroomId }, classroom, (err, classroom) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })

            return res.status(200).send({ message: `user: ${req.body.userId} added as administrator` })
        })
    } else {
        //if userId is already admin of this class
        return res.status(200).send(false)
    }
}

/**
 * add user to white list
 * @param {*} req 
 * @param {*} res 
 */
async function addUserWhiteList(req, res) {
    let classroom = await Classroom.findById(req.body.classroomId)
    if (classroom.whiteList.indexOf(req.body.userId) < 0) {
        classroom.whiteList.push(req.body.userId)

        Classroom.findOneAndUpdate({ _id: req.body.classroomId }, classroom, (err, classroom) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })

            return res.status(200).send({ message: `user: ${req.body.userId} added` })
        })
    } else {
        //if userId is already admin of this class
        return res.status(200).send(false)
    }
}

/**
 * delete user as administrator
 * @param {*} req 
 * @param {*} res 
 */
async function deleteAdmin(req, res) {
    Classroom.findOne({ _id: req.body.classroomId }, (err, classroom) => {
        if (err) return res.status(500).send(err)
        if (classroom.administrators.length > 1) {
            let index = classroom.administrators.indexOf(req.body.userId);
            if (index > -1) {
                classroom.administrators.splice(index, 1);
                Classroom.findOneAndUpdate({ _id: req.body.classroomId }, classroom, (err, classroom) => {
                    if (err) return res.status(500).send(false)
                    return res.status(200).send(true)
                })
            }
        } else {
            //{ message: `there must be at least one admin` }
            res.status(200).send(false)
        }
    })
}

/**
 * delete user white list
 * @param {*} req 
 * @param {*} res 
 */
async function deleteUserWhiteList(req, res) {
    Classroom.findOne({ _id: req.body.classroomId }, (err, classroom) => {
        if (err) return res.status(500).send(err)

        let index = classroom.whiteList.indexOf(req.body.userId);
        if (index > -1) {
            classroom.whiteList.splice(index, 1);
            Classroom.findOneAndUpdate({ _id: req.body.classroomId }, classroom, (err, classroom) => {
                if (err) return res.status(500).send({ message: `Error: ${err}` })
                return res.status(200).send(true)
            })
        }

    })
}

function signInClassroom(req, res) {
    Classroom.findOne({ _id: req.body.classroomId }, (err, classroom) => {
        if (err) return res.status(500).send({ message: err })
        if (!classroom) return res.status(404).send({ message: `${err}` })

        //compare candidate password
        classroom.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
            if (!isMatch) {
                return res.status(200).send(false)
            } else {
                res.status(200).send(true)
            }
        })
    }).select('+password');
}

/**
 * check if the user is an administrator
 * @param {*} req 
 * @param {*} res 
 */
async function checkAdmin(req, res) {
    Classroom.findOne({ _id: req.body.classroomId }, (err, classroom) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (classroom.administrators.indexOf(req.body.userId) > -1) {
            return res.status(200).send(true)
        } else {
            return res.status(200).send(false)
        }
    })
}

/**
 * check if the user white list
 * @param {*} req 
 * @param {*} res 
 */
async function checkWhiteList(req, res) {
    Classroom.findOne({ _id: req.body.classroomId }, (err, classroom) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (classroom.whiteList.indexOf(req.body.userId) > -1) {
            return res.status(200).send(true)
        } else {
            return res.status(200).send(false)
        }
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
 * get administrators of a class
 * @param {*} req 
 * @param {*} res 
 */
async function getClassAdmins(req, res) {
    let classroom = await Classroom.findOne({ _id: req.body.classroomId })
    if (classroom.administrators.length == 0) return res.status(404).send(false)
    return res.status(200).send(classroom.administrators)
}

/**
 * get white list of a class
 * @param {*} req 
 * @param {*} res 
 */
async function getClassUserWhiteList(req, res) {
    let classroom = await Classroom.findOne({ _id: req.body.classroomId })
    if (classroom.whiteList.length == 0) return res.status(200).send(false)
    return res.status(200).send(classroom.whiteList)
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
        if (err) return res.status(200).send({ message: `Error server: ${err}` })
        if (classrooms.length == 0) return res.status(200).send(false)
        return res.status(200).send(classrooms)
    })
}

/**
 * get classroom by id
 * @param {*} req 
 * @param {*} res 
 */
async function getClassroomById(req, res) {
    let classroomId = req.body.classroomId;
    Classroom.findById({ _id: classroomId }, (err, classroom) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (!classroom) return res.status(200).send(false)
        return res.status(200).send(classroom)
    })
}

/**
 * delete classroom
 * @param {*} req 
 * @param {*} res 
 */
function deleteClassroom(req, res) {
    Classroom.findByIdAndRemove({ _id: req.params.classroomid }, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        //remove all sections, documents and comments contained in this classroom
        Section.deleteMany({ _id_classroom: req.params.classroomid }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })
        Doc_private.deleteMany({ _id_classroom: req.params.classroomid }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })
        Comment.deleteMany({ _id_classroom: req.params.classroomid }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })

        //remove all containers from the classroom
        let pathFile = path.resolve(__dirname + "/../../classroom/" + req.params.classroomid)
        rimraf.sync(pathFile);

        res.status(200).send(true)
    })
}

/**
 * update classroom
 * @param {*} req 
 * @param {*} res 
 */
async function updateClassroom(req, res) {

    // Check empty camps
    if (req.body.classroomId == null ||
        req.body.classroomId == ""
    ) {
        return res.status(500).send({ message: `Error updating the class room: empty camps` })
    }

    // Password validation between 4 and 10 characters
    if (req.body.password) {
        if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
            message: `the password must be between 4 and 10 characters`
        });
        let classroom = new Classroom()
        classroom.cryptPassword(req.body.password, (err, passEncrypt) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
            req.body.password = passEncrypt
        })
    }

    // classroomName validation 
    if (req.body.classroomName) {
        if (!(parameters.expReg.classroomName.test(req.body.classroomName))) return res.status(400).send({ message: parameters.errMessage.categoryName });
    }

    // Check duplication classroomName
    try {
        let exp = new RegExp(req.body.classroomName, 'i');
        let classroomFound = await Classroom.findOne({ classroomName: { $regex: exp } });

        if (classroomFound) {
            if (classroomFound._id != req.body.classroomId) { //{ message: `the class room name: ${req.body.classroomName} is already registered` }
                return res.status(200).send(false);
            }
        }
        let update = req.body;
        //update classroom
        Classroom.findOneAndUpdate({ _id: req.body.classroomId }, update, (err, classroom) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
            res.status(200).send(true)
        })
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }
}

/**
 * send request to recover password
 * @param {*} req 
 * @param {*} res 
 */
async function restorePassword(req, res) {
    let classId = req.body.classId

    //get classroom by id
    Classroom.findById({ _id: classId }, (err, classroom) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })

        //check if the user is administrator of this class
        if (classroom.administrators.indexOf(req.body.userId) > -1) {
            let rp = new RestorePassword({
                _id_subject: classroom._id
            })

            //insert new restorePassword
            rp.save((err, rpGenerated) => {
                if (err) res.status(500).send({ message: `Error creating the user: ${err}` })

                //find user to get email, userName, id
                User.findById({ _id: req.body.userId }, (err, user) => {
                    if (err) res.status(500).send({ message: `Error creating the user: ${err}` })
                    mailer.sendResetPasswordClassroom(user.email, rpGenerated._id, user.userName, user._id)
                    return res.status(200).send(true);
                })
            })
        } else {
            return res.status(200).send(false)
        }
    })
}

/**
 * send new password of request to recover password
 * @param {*} req 
 * @param {*} res 
 */
async function sendNewPassword(req, res) {
    let restId = req.params.restoreid
    RestorePassword.findById({ _id: restId }, (err, rp) => {
        if (err) res.status(500).send({ message: `Error creating the user: ${err}` })
        if (rp) {
            if (!rp.finished) { //if not processed
                //generate new password
                let password = generator.generate({
                    length: 10,
                    numbers: true
                });
                let classroom = new Classroom()

                //encryp new password
                classroom.cryptPassword(password, (err, passEncrypt) => {
                    if (err) return res.status(500).send({ message: `Error server: ${err}` })
                    classroom = {
                        password: passEncrypt
                    }

                    //update classroom password
                    Classroom.findOneAndUpdate({ _id: rp._id_subject }, classroom, (err, classroomUpdate) => {
                        if (err) return res.status(500).send({ message: `Error server: ${err}` })

                        //update status finished to true
                        rp = {
                            finished: true
                        }

                        //update restorePassword
                        RestorePassword.findOneAndUpdate({ _id: restId }, rp, (err, rpUpdate) => {
                            if (err) return res.status(500).send({ message: `Error server: ${err}` })

                            //find user to get email and userName
                            User.findById({ _id: req.params.userid }, (err, user) => {
                                if (err) return res.status(500).send({ message: `Error server: ${err}` })
                                mailer.passwordRestoredClassroom(user.email, password, user.userName, classroomUpdate.classroomName)
                                return res.status(200).send(true)
                            })
                        })
                    })
                })

            } else { //if request has already been processed
                return res.status(200).send(false)
            }
        }
    })
}

module.exports = {
    newClassroom,
    checkAdmin,
    addAdmin,
    signInClassroom,
    deleteAdmin,
    getClassrooms,
    getClassAdmins,
    getClassroomsByClassroomName,
    getClassroomById,
    deleteClassroom,
    updateClassroom,
    checkWhiteList,
    addUserWhiteList,
    deleteUserWhiteList,
    getClassUserWhiteList,
    restorePassword,
    sendNewPassword
}