'use strict'

const User = require('../models/user')
const serviceJwt = require('../services/jwt')

/**
 * Save user
 * @param {*} req 
 * @param {*} res 
 */
async function signUp(req, res) {
    // Check empty camps
    if (req.body.email == null ||
        req.body.email == "" ||
        req.body.password == null ||
        req.body.password == "" ||
        req.body.userName == null ||
        req.body.userName == "" ||
        req.body.rol_id == null ||
        req.body.rol_id == "") {
        return res.status(500).send({ message: `Error creating the user: empty camps` })
    }

    // Email validation 
    if (!(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(req.body.email))) return res.status(400).send({ message: "Email not valid" });

    // Password validation between 4 and 10 characters
    if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
        message: `the password must be between 4 and 10 characters`
    });

    // userName validation 
    if (!(/^[A-Za-z][A-Za-z0-9]{2,9}$/.test(req.body.userName))) return res.status(400).send({ message: "user name not valid" });

    // Check duplication email
    try {
        let emailFound = await User.findOne({ email: req.body.email });
        if (emailFound) {
            return res.status(400).send({ message: `the email: ${req.body.email} is already registered` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Check duplication userName
    try {
        let userFound = await User.findOne({ email: req.body.email });
        if (userFound) {
            return res.status(400).send({ message: `the user name: ${req.body.userName} is already registered` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Save user
    let user = new User({
        email: req.body.email,
        password: req.body.password,
        userName: req.body.userName,
        rol_id: req.body.rol_id,
    })

    user.avatar = user.gravatar();

    user.save((err, user) => {
        if (err) res.status(500).send({ message: `Error creating the user: ${err}` })
        return res.status(200).send({
            token: serviceJwt.createToken(user),
            user: user.id
        });
    })
}

function signIn(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send({ message: err })
        if (!user) return res.status(404).send({ message: `wrong username or password` })

        return user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
            if (!isMatch) return res.status(404).send({ message: `wrong username or password` })

            req.user = user
            res.status(200).send({
                message: 'Te has logueado correctamente',
                token: serviceJwt.createToken(user)
            })
        })
    }).select('_id email +password');
}

async function getUserEmail(req, res) {
    let userName = req.params.userName;
    let exp = new RegExp(userName, 'i');
    User.find({ email: { $regex: exp } }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (user.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ usuario: user })
    })
}

async function getUserUserName(req, res) {
    let userName = req.params.userName;
    let exp = new RegExp(userName, 'i');
    User.find({ email: { $regex: exp } }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (user.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ usuario: user })
    })
}

module.exports = {
    signUp,
    signIn,
    getUserEmail,
    getUserUserName
}