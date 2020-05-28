'use strict'

const Comment = require('../models/comment')
const User = require('../models/user')

/**
 * new comment
 * @param {*} req 
 * @param {*} res 
 */
async function newComment(req, res) {
    // Check empty camps
    if (req.body.classroomId == null ||
        req.body.classroomId == "" ||
        req.body.sectionId == null ||
        req.body.sectionId == "" ||
        req.body.userId == null ||
        req.body.userId == "" ||
        req.body.writeAdmin == undefined ||
        req.body.text == null ||
        req.body.text == "") {
        return res.status(500).send({ message: `Error creating the comment: empty camps` })
    }

    // comment validation 
    if (req.body.text.length > 1024 || req.body.text.length < 1) return res.status(400).send({ message: `the comment must be between 1 and 512 characters` });


    User.findById({ _id: req.body.userId }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })

        // Save comment
        let comment = new Comment({
            _id_classroom: req.body.classroomId,
            _id_section: req.body.sectionId,
            _id_user: req.body.userId,
            userName: user['userName'],
            writeAdmin: req.body.writeAdmin,
            text: req.body.text,
        })
        comment.save((err, comment) => {
            if (err) res.status(500).send({ message: `Error creating the comment: ${err}` })
            return res.status(200).send(true);
        })
    })
}

async function getCommentFromSection(req, res) {
    Comment.find({ _id_section: req.body.sectionId }, (err, comments) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (comments.length == 0) return res.status(200).send(false)
        res.status(200).send(comments)
    }).sort('creationDate')
}

/**
 * delete comment
 * @param {*} req 
 * @param {*} res 
 */
function deleteComment(req, res) {
    Comment.findByIdAndRemove({ _id: req.body.commentId }, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send(true)
    })
}

/**
 * remove all comment of section
 * @param {*} req 
 * @param {*} res 
 */
function deleteAllComments(req, res) {
    Comment.deleteMany({ _id_section: req.params.sectionid }, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        return res.status(200).send(true)
    })
}

async function updateComment(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.text == null ||
        req.body.text == "" ||
        req.body.commentId == null ||
        req.body.commentId == "") {
        return res.status(500).send({ message: `Error updating the section: empty camps` })
    }

    // comment validation 
    if (req.body.text.length > 512 || req.body.text.length < 1) return res.status(400).send({ message: `the comment must be between 1 and 512 characters` });

    //update comment
    Comment.findOneAndUpdate({ _id: req.body.commentId }, update, (err, comment) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ Comment: comment })
    })
}

module.exports = {
    newComment,
    getCommentFromSection,
    deleteComment,
    deleteAllComments,
    updateComment
}