"use strict";

const serviceJwt = require("../services/jwt");
const jwt = require('jwt-simple')
const User = require('../models/user')

function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: "Forbidden: You don't have permission to access on this server"
        });
    }

    const token = req.headers.authorization;
    serviceJwt
        .decodeToken(token)
        .then(response => {
            req.user = response;
            next();
        })
        .catch(response => {
            return res.status(403).send({
                message: "Invalid token"
            });
        });
}

module.exports = isAuth;