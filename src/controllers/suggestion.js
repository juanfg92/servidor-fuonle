'use strict'

const Suggestion = require('../models/suggestion')
const parameters = require('../../parameters')

/**
 * new suggestion
 * @param {*} req 
 * @param {*} res 
 */
async function newSuggestion(req, res) {
    // Check empty camps
    if (req.body.userId == null ||
        req.body.userId == "" ||
        req.body.tittle == null ||
        req.body.tittle == "" ||
        req.body.description == null ||
        req.body.description == "") {
        return res.status(500).send({ message: `Error creating the suggestion: empty camps` })
    }

    //tittle validation
    if (!(parameters.expReg.suggestionTittle.test(req.body.tittle))) return res.status(400).send({ message: parameters.errMessage.suggestionTittle });

    // description validation 
    if (req.body.description.length > 512 || req.body.description.length < 1) return res.status(400).send({ message: `the description must be between 1 and 512 characters` });

    // Save suggestion
    let suggestion = new Suggestion({
        _id_user: req.body.userId,
        tittle: req.body.tittle,
        description: req.body.description
    })

    suggestion.save((err, suggestion) => {
        if (err) res.status(500).send({ message: `Error creating the suggestion: ${err}` })
        return res.status(200).send({ suggestion: suggestion });
    })
}

/**
 * get suggestions unprocess
 * @param {*} req 
 * @param {*} res 
 */
async function getSuggestionsUnprocessed(req, res) {
    Suggestion.find({ processed: false }, (err, suggestions) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (suggestions.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Suggestions: suggestions })
    })
}

/**
 * get suggestions process
 * @param {*} req 
 * @param {*} res 
 */
async function getSuggestionsProcessed(req, res) {
    Suggestion.find({ processed: true }, (err, suggestions) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (suggestions.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Suggestions: suggestions })
    })
}

/**
 * get all suggestions
 * @param {*} req 
 * @param {*} res 
 */
async function getAllSuggestions(req, res) {
    Suggestion.find({}, (err, suggestions) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (suggestions.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Suggestions: suggestions })
    })
}

/**
 * delete suggestion
 * @param {*} req 
 * @param {*} res 
 */
function deleteSuggestion(req, res) {
    Suggestion.findByIdAndRemove(req.body.suggestionId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ message: `suggestion ${req.body.suggestionId} has been deleted` })
    })
}

/**
 * update suggestion
 * @param {*} req 
 * @param {*} res 
 */
async function updateSuggestion(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.suggestionId == null ||
        req.body.suggestionId == "" ||
        req.body.tittle == null ||
        req.body.tittle == "" ||
        req.body.description == null ||
        req.body.description == "") {
        return res.status(500).send({ message: `Error updating the suggestion: empty camps` })
    }

    //tittle validation
    if (!(parameters.expReg.suggestionTittle.test(req.body.tittle))) return res.status(400).send({ message: parameters.errMessage.suggestionTittle });


    //description validation 
    if (req.body.description.length > 512 || req.body.description.length < 1) return res.status(400).send({ message: `the suggestion must be between 1 and 512 characters` });

    //update suggestion
    Suggestion.findOneAndUpdate({ _id: req.body.suggestionId }, update, (err, suggestion) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ Suggestion: suggestion })
    })
}

module.exports = {
    newSuggestion,
    getSuggestionsUnprocessed,
    getSuggestionsProcessed,
    getAllSuggestions,
    deleteSuggestion,
    updateSuggestion
}