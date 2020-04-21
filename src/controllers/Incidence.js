'use strict'

const Incidence = require('../models/incidence')

/**
 * new incidence
 * @param {*} req 
 * @param {*} res 
 */
async function newIncidence(req, res) {
    // Check empty camps
    if (req.body.userId == null ||
        req.body.userId == "" ||
        req.body.documentId == null ||
        req.body.documentId == "" ||
        req.body.description == null ||
        req.body.description == "") {
        return res.status(500).send({ message: `Error creating the incidence: empty camps` })
    }

    // incidence validation 
    if (req.body.description.length > 512 || req.body.description.length < 1) return res.status(400).send({ message: `the incidence must be between 1 and 512 characters` });

    // Save incidence
    let incidence = new Incidence({
        _id_user: req.body.userId,
        _id_document: req.body.documentId,
        description: req.body.description
    })

    incidence.save((err, incidence) => {
        if (err) res.status(500).send({ message: `Error creating the incidence: ${err}` })
        return res.status(200).send({ Incidence: incidence });
    })
}

/**
 * get incidents unprocess
 * @param {*} req 
 * @param {*} res 
 */
async function getIncidentsUnprocessed(req, res) {
    Incidence.find({ processed: false }, (err, incidents) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (incidents.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Incidents: incidents })
    })
}

/**
 * get incidents process
 * @param {*} req 
 * @param {*} res 
 */
async function getIncidentsProcessed(req, res) {
    Incidence.find({ processed: true }, (err, incidents) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (incidents.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Incidents: incidents })
    })
}

/**
 * get all incidents
 * @param {*} req 
 * @param {*} res 
 */
async function getAllIncidents(req, res) {
    Incidence.find({}, (err, incidents) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (incidents.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Incidents: incidents })
    })
}

/**
 * delete incidence
 * @param {*} req 
 * @param {*} res 
 */
function deleteIncidence(req, res) {
    Incidence.findByIdAndRemove(req.body.incidenceId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ message: `incidence ${req.body.incidenceId} has been deleted` })
    })
}

async function updateIncidence(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.incidenceId == null ||
        req.body.incidenceId == "" ||
        req.body.description == null ||
        req.body.description == "") {
        return res.status(500).send({ message: `Error updating the incidence: empty camps` })
    }

    // incidence validation 
    if (req.body.description.length > 512 || req.body.description.length < 1) return res.status(400).send({ message: `the incidence must be between 1 and 512 characters` });

    //update incidence
    Incidence.findOneAndUpdate({ _id: req.body.incidenceId }, update, (err, incidence) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ Incidence: incidence })
    })
}

module.exports = {
    newIncidence,
    getIncidentsUnprocessed,
    getIncidentsProcessed,
    getAllIncidents,
    deleteIncidence,
    updateIncidence
}