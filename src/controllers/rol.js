'use strict'

const Rol = require('../models/rol')
const parameters = require('../../parameters')

/**
 * new rol
 * @param {*} req 
 * @param {*} res 
 */
async function newRol(req, res) {
    // Check empty camps
    if (req.body.name == null ||
        req.body.name == "" ||
        req.body.description == null ||
        req.body.description == "") {
        return res.status(500).send({ message: `Error creating the rol: empty camps` })
    }

    //name validation
    if (!(parameters.expReg.rolName.test(req.body.name))) return res.status(400).send({ message: parameters.errMessage.rolName });

    //description validation
    if (!(parameters.expReg.rolDescription.test(req.body.description))) return res.status(400).send({ message: parameters.errMessage.rolDescription });

    // Save rol
    let rol = new Rol({
        name: req.body.name,
        description: req.body.description
    })

    rol.save((err, rol) => {
        if (err) res.status(500).send({ message: `Error creating the rol: ${err}` })
        return res.status(200).send({ Rol: rol });
    })
}

/**
 * get all rols
 * @param {*} req 
 * @param {*} res 
 */
async function getAllrols(req, res) {
    Rol.find({}, (err, rols) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (rols.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Rols: rols })
    })
}

/**
 * get rol
 * @param {*} req 
 * @param {*} res 
 */
async function getRolById(req, res) {
    Rol.findOne({ _id: req.body.rolId }, (err, rol) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (!rol) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Rol: rol })
    })
}

/**
 * delete rol
 * @param {*} req 
 * @param {*} res 
 */
function deleteRol(req, res) {
    Rol.findByIdAndRemove(req.body.rolId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ message: `rol ${req.body.rolId} has been deleted` })
    })
}

/**
 * update rol
 * @param {*} req 
 * @param {*} res 
 */
async function updateRol(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.rolId == null ||
        req.body.rolId == "" ||
        req.body.name == null ||
        req.body.name == "" ||
        req.body.description == null ||
        req.body.description == "") {
        return res.status(500).send({ message: `Error updating the rol: empty camps` })
    }

    //name validation
    if (!(parameters.expReg.rolName.test(req.body.name))) return res.status(400).send({ message: parameters.errMessage.rolName });

    //description validation
    if (!(parameters.expReg.rolDescription.test(req.body.description))) return res.status(400).send({ message: parameters.errMessage.rolDescription });

    //description validation 
    if (req.body.description.length > 512 || req.body.description.length < 1) return res.status(400).send({ message: `the rol must be between 1 and 512 characters` });

    //update rol
    Rol.findOneAndUpdate({ _id: req.body.rolId }, update, (err, rol) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ Rol: rol })
    })
}

module.exports = {
    newRol,
    getRolById,
    getAllrols,
    deleteRol,
    updateRol
}