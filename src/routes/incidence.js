'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')
const incidenceCtrl = require('../controllers/Incidence')

api.post('/new-incidence', incidenceCtrl.newIncidence)
api.get('/get-incidents-unprocessed', incidenceCtrl.getIncidentsUnprocessed)
api.get('/get-incidents-processed', incidenceCtrl.getIncidentsProcessed)
api.get('/get-all-incidents', incidenceCtrl.getAllIncidents)
api.delete('/delete-incidence', incidenceCtrl.deleteIncidence)
api.put('/update-incidence', incidenceCtrl.updateIncidence)

module.exports = api