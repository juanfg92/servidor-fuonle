'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const incidenceCtrl = require('../controllers/Incidence')

api.post('/new-incidence', auth, incidenceCtrl.newIncidence)
api.get('/get-incidents-unprocessed', auth, incidenceCtrl.getIncidentsUnprocessed)
api.get('/get-incidents-processed', auth, incidenceCtrl.getIncidentsProcessed)
api.get('/get-all-incidents', auth, incidenceCtrl.getAllIncidents)
api.delete('/delete-incidence', auth, incidenceCtrl.deleteIncidence)
api.put('/update-incidence', auth, incidenceCtrl.updateIncidence)

module.exports = api