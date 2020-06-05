'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const suggestionCtrl = require('../controllers/suggestion')

api.post('/new-suggestion', auth, suggestionCtrl.newSuggestion)
api.get('/get-suggestions-unprocessed', auth, suggestionCtrl.getSuggestionsUnprocessed)
api.get('/get-suggestions-processed', auth, suggestionCtrl.getSuggestionsProcessed)
api.get('/get-all-suggestions', auth, suggestionCtrl.getAllSuggestions)
api.delete('/delete-suggestion', auth, suggestionCtrl.deleteSuggestion)
api.put('/update-suggestion', auth, suggestionCtrl.updateSuggestion)

module.exports = api