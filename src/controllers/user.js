'use strict'

const User = require('../models/user')
const serviceJwt = require('../services/jwt')
const parameters = require('../../parameters')

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
        req.body.rolId == null ||
        req.body.rolId == "") {
        return res.status(500).send({ message: `Error creating the user: empty camps` })
    }

    // Email validation 
    if (!(parameters.expReg.userEmail.test(req.body.email))) return res.status(400).send({ message: parameters.errMessage.userEmail });

    // Password validation between 4 and 10 characters
    if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
        message: `the password must be between 4 and 10 characters`
    });

    // userName validation 
    if (!(parameters.expReg.userName.test(req.body.userName))) return res.status(400).send({ message: parameters.errMessage.userName });

    // Check duplication email
    try {
        let exp = new RegExp(req.body.email, 'i');
        let emailFound = await User.findOne({ email: { $regex: exp } });
        if (emailFound) {
            return res.status(400).send({ message: `the email: ${req.body.email} is already registered` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Check duplication userName
    try {
        let exp = new RegExp(req.body.userName, 'i');
        let name = req.body.userName
        let userFound = await User.findOne({ userName: req.body.userName });
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
        _id_rol: req.body.rolId,
    })
    user.token = serviceJwt.createToken(user);
    user.avatar = user.gravatar();

    user.save((err, user) => {
        if (err) res.status(500).send({ message: `Error creating the user: ${err}` })
        return res.status(200).send({
            user: user.id
        });
    })
}

/**
 * Log user
 * @param {*} req 
 * @param {*} res 
 */
function signIn(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send({ message: err })
        if (!user) return res.status(404).send({ message: `wrong username or password` })

        //compare candidate password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
            if (!isMatch) {
                return res.status(404).send({ message: `wrong username or password` })
            } else {
                user.token = serviceJwt.createToken(user)

                //update userToken
                User.findOneAndUpdate({ _id: user._id }, user, (err) => {
                    if (err) {
                        return res.status(500).send({ message: `Error server: ${err}` })
                    }
                })
                res.status(200).send(user)
            }
        })
    }).select('+password');
}

/**
 * find user by email
 * @param {*} req 
 * @param {*} res 
 */
async function getUserByJwt(req, res) {
    let userJwt = req.body.jwt;
    User.findOne({ token: userJwt }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (!user) return res.status(404).send(false)
        return res.status(200).send({ user: user })
    })
}

/**
 * get all users
 * @param {*} req 
 * @param {*} res 
 */
async function getUsers(req, res) {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (users.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ usuario: users })
    })
}

/**
 * find user by email
 * @param {*} req 
 * @param {*} res 
 */
async function getUserByEmail(req, res) {
    let userEmail = req.body.email;
    let exp = new RegExp(userEmail, 'i');
    User.find({ email: { $regex: exp } }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (user.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ usuario: user })
    })
}

/**
 * find user by userName
 * @param {*} req 
 * @param {*} res 
 */
async function getUserByUserName(req, res) {
    let userName = req.body.userName;
    let exp = new RegExp(userName, 'i');
    User.find({ userName: { $regex: exp } }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (user.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ usuario: user })
    })
}

/**
 * delete user
 * @param {*} req 
 * @param {*} res 
 */
async function deleteUser(req, res) {
    let userId = req.body.userId;

    User.findByIdAndRemove(userId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ message: `user ${userId} has been deleted` })
    })
}

/**
 * update user
 * at the moment, he can only change password
 * @param {*} req 
 * @param {*} res 
 */
async function updateUser(req, res) {
    let userId = req.body.userId;
    let update = req.body;

    // Check empty camps
    if (req.body.email == null ||
        req.body.email == "" ||
        req.body.password == null ||
        req.body.password == "" ||
        req.body.userName == null ||
        req.body.userName == "" ||
        req.body.rolId == null ||
        req.body.rolId == "") {
        return res.status(500).send({ message: `Error updating the user: empty camps` })
    }

    // Email validation 
    // if (!(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(req.body.email))) return res.status(400).send({ message: "Email not valid" });

    // Password validation between 4 and 10 characters
    if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
        message: `the password must be between 4 and 10 characters`
    });

    // userName validation 
    // if (!(/^[A-Za-z][A-Za-z0-9 ]{2,19}$/.test(req.body.userName))) return res.status(400).send({ message: `the user name must be between 2 and 20 characters, not contain spaces and empy start with a letter` });

    // Check duplication email
    // try {
    //     let emailFound = await User.findOne({ email: req.body.email });
    //     if (emailFound) {
    //         return res.status(400).send({ message: `the email: ${req.body.email} is already registered` });
    //     }
    // } catch (err) {
    //     return res.status(500).send({ message: `Error server: ${err}` });
    // }

    // Check duplication userName
    // try {
    //     let userFound = await User.findOne({ userName: req.body.userName });
    //     if (userFound) {
    //         return res.status(400).send({ message: `the user name: ${req.body.userName} is already registered` });
    //     }
    // } catch (err) {
    //     return res.status(500).send({ message: `Error server: ${err}` });
    // }

    //update user
    User.findOneAndUpdate(userId, update, (err, userUpdate) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        res.status(200).send({ user: userUpdate })
    })
}

module.exports = {
    signUp,
    signIn,
    getUserByJwt,
    getUsers,
    getUserByEmail,
    getUserByUserName,
    deleteUser,
    updateUser
}