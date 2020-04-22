'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const suggestionCtrl = require('../controllers/suggestion')

api.post('/new-suggestion', suggestionCtrl.newSuggestion)
api.get('/get-suggestions-unprocessed', suggestionCtrl.getSuggestionsUnprocessed)
api.get('/get-suggestions-processed', suggestionCtrl.getSuggestionsProcessed)
api.get('/get-all-suggestions', suggestionCtrl.getAllSuggestions)
api.delete('/delete-suggestion', suggestionCtrl.deleteSuggestion)
api.put('/update-suggestion', suggestionCtrl.updateSuggestion)

module.exports = api