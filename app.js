'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./src/routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api-aprende-para-crecer', api)

module.exports = app;