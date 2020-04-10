'use strict'

const User = require('../models/user')
const serviceJwt = require('../services/jwt')

/**
 * Save user
 * @param {*} req 
 * @param {*} res 
 */
async function signUp(req, res) {
    let existsEmail = false
    let existsUserName = false

    // Check empty camps
    if (req.body.email != null &&
        req.body.email != "" &&
        req.body.password != null &&
        req.body.password != "" &&
        req.body.userName != null &&
        req.body.userName != "" &&
        req.body.rol_id != null &&
        req.body.rol_id != "") {

        // Email validation 
        if (!(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(req.body.email))) return res.status(400).send({ message: "Email not valid" });
        // Password validation between 4 and 10 characters
        if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
            message: `the password must be between 4 and 10 characters`
        });

        // Check duplication email
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) return res.status(500).send({ message: err })
            if (user) {
                existsEmail = true
                return res.status(403).send({ message: `the email: ${req.body.email} is already registered` })
            }

            // Check duplication userName
            if (!existsEmail) {
                User.findOne({ userName: req.body.userName }, (err, user) => {
                    if (err) return res.status(500).send({ message: err })
                    if (user) {
                        existsUserName = true
                        return res.status(403).send({ message: `the user name: ${req.body.userName} is already registered` })
                    }
                })
            }
        })

        // Save user
        if (!existsEmail || !existsUserName) {
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

    } else {
        res.status(500).send({ message: `Error creating the user: empty camps` })
    }
}

function signIn(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send({ message: err })
        if (!user) return res.status(404).send({ message: `No existe el usuario: ${req.body.email}` })

        return user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ msg: `Error al ingresar: ${err}` })
            if (!isMatch) return res.status(404).send({ msg: `Error de contraseña: ${req.body.email}` })

            req.user = user
            res.status(200).send({
                message: 'Te has logueado correctamente',
                token: service.createToken(user)
            })
        })
    }).select('_id email +password');
}




async function getUser(req, res) {

    let userName = req.params.userName;
    let exp = new RegExp(userName, 'i');
    User.find({ displayName: { $regex: exp } }, (err, user) => {
        if (err) return res.status(500).send({ message: "error en la peticion" })
        if (!user) return res.status(404).send({ message: "No se obtubieron resultados" })
        res.status(200).send({ usuario: user })
    })

}

module.exports = {
    signUp,
    signIn,
    getUser
}