'use strict'

const User = require('../models/user')
const RestorePassword = require('../models/restore_password')
const serviceJwt = require('../services/jwt')
const parameters = require('../../parameters')
const mailer = require('../services/mailer')
var generator = require('generate-password');

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
            return res.status(200).send({ email: 'false' });
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
            return res.status(200).send({ userName: 'false' });
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
        mailer.sendWelcomeEmail(user.email, user.userName)
        return res.status(200).send(true);
    })
}

/**
 * Log user
 * @param {*} req 
 * @param {*} res 
 */
async function signIn(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send({ message: err })
        if (!user) return res.status(200).send(false)

        //compare candidate password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ message: `Error: ${err}` })
            if (!isMatch) {
                return res.status(200).send(false)
            } else {

                user.token = serviceJwt.createToken(user)

                //update userToken
                User.findOneAndUpdate({ _id: user._id }, user, (err) => {
                    if (err) {
                        return res.status(500).send({ message: `Error server: ${err}` })
                    }
                    return res.status(200).send(user)
                })

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
        if (!user) return res.status(200).send(false)
        return res.status(200).send(user)
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
async function getUsersByEmail(req, res) {
    let userEmail = req.body.email;
    let exp = new RegExp(userEmail, 'i');
    User.find({ email: { $regex: exp } }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (user.length == 0) return res.status(404).send(false)
        return res.status(200).send(user)
    })
}

/**
 * find users by id
 * @param {*} req 
 * @param {*} res 
 */
async function getUsersById(req, res) {
    let userIds = req.body.userIds;

    User.find().where('_id').in(userIds).exec((err, users) => {
        if (err) return res.status(500).send(err)
        return res.status(200).send(users)
    })


}

/**
 * get user by id
 * @param {*} req 
 * @param {*} res 
 */
async function getUserById(req, res) {
    User.findById(req.body.userId, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (!user) return res.status(404).send(false)
        return res.status(200).send(user)
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

async function getUserByEmail(req, res) {
    let email = req.body.email;
    let exp = new RegExp(email, 'i');
    User.findOne({ email: { $regex: exp } }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (!user) return res.status(200).send(false)
        return res.status(200).send(user)
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
 * add favorite doc to user
 * @param {*} req 
 * @param {*} res 
 */
async function addDocFavorite(req, res) {
    let user = await User.findById(req.body.userId)
        //20 documents max
    if (user._id_docs_favorites.length > 20) {
        return res.status(200).send({ maxFiles: `you cannot have more than 20 favorite documents` })
    } else {
        if (user._id_docs_favorites.indexOf(req.body.docId) == -1) {
            user._id_docs_favorites.push(req.body.docId)

            User.findOneAndUpdate({ _id: req.body.userId }, user, (err, user) => {
                if (err) return res.status(500).send({ message: `Error server: ${err}` })

                return res.status(200).send({ message: `user: ${req.body.userId} added as administrator` })
            })
        } else {
            //if document is already favorite of user
            return res.status(200).send(false)
        }
    }
}

/**
 * remove favorite doc of user
 * @param {*} req 
 * @param {*} res 
 */
async function deleteDocFavorite(req, res) {
    User.findOne({ _id: req.body.userId }, (err, user) => {
        if (err) return res.status(500).send(err)
        let index = user._id_docs_favorites.indexOf(req.body.docId);
        if (index > -1) {
            user._id_docs_favorites.splice(index, 1);
            User.findOneAndUpdate({ _id: req.body.userId }, user, (err, user) => {
                if (err) return res.status(500).send(false)
                return res.status(200).send(true)
            })
        }
    })
}

/**
 * get all documents favorites of a user
 * @param {*} req 
 * @param {*} res 
 */
async function getDocFavUser(req, res) {
    let user = await User.findOne({ _id: req.body.userId })
    if (user._id_docs_favorites.length == 0) return res.status(200).send(false)
    return res.status(200).send(user._id_docs_favorites)
}

/**
 * update user
 * at the moment, he can only change password
 * @param {*} req 
 * @param {*} res 
 */
async function updateUser(req, res) {
    let userId = req.body.userId;

    // Check empty camps
    if (req.body.email == null ||
        req.body.email == "" ||
        req.body.password == null ||
        req.body.password == "" ||
        req.body.newPassword == "" ||
        req.body.newPassword == ""
    ) {
        return res.status(500).send({ message: `Error updating the user: empty camps` })
    }

    // Password validation between 4 and 10 characters
    if (req.body.newPassword) {
        if (req.body.newPassword.length < 4 || req.body.newPassword.length > 10) return res.status(400).send({
            message: `the password must be between 4 and 10 characters`
        });
        let user = new User()
        user.cryptPassword(req.body.newPassword, (err, passEncrypt) => {
            if (err) return res.status(500).send({ message: `Error server: ${err}` })
            req.body.newPassword = passEncrypt
        })
    }

    User.findById({ _id: req.body.userId }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ message: `Error: ${err}` })
            if (!isMatch) {
                return res.status(200).send(false)
            } else {
                //update password
                req.body.password = req.body.newPassword
                User.findOneAndUpdate({ _id: req.body.userId }, req.body, (err, userUpdate) => {
                    if (err) {
                        return res.status(500).send({ message: `Error server: ${err}` })
                    }
                    return res.status(200).send(true)
                })
            }
        })
    }).select('+password');
}

/**
 * send request to recover password
 * @param {*} req 
 * @param {*} res 
 */
async function restorePassword(req, res) {
    let email = req.body.email
    let exp = new RegExp(email, 'i');
    //get user by email
    User.findOne({ email: { $regex: exp } }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (!user) return res.status(200).send(false)
        if (user) {
            let rp = new RestorePassword({
                _id_subject: user._id
            })
            rp.save((err, rpGenerated) => {
                if (err) res.status(500).send({ message: `Error creating the user: ${err}` })
                mailer.sendResetPasswordUser(user.email, rpGenerated._id, user.userName, user._id)
                return res.status(200).send(true);
            })
        }
    })
}

/**
 * send new password of request to recover password
 * @param {*} req 
 * @param {*} res 
 */
async function sendNewPassword(req, res) {
    let restId = req.params.restoreid
    RestorePassword.findById({ _id: restId }, (err, rp) => {
        if (err) res.status(500).send({ message: `Error creating the user: ${err}` })
        if (rp) {
            if (!rp.finished) { //if not processed
                //generate new password
                let password = generator.generate({
                    length: 10,
                    numbers: true
                });
                let user = new User()
                user.cryptPassword(password, (err, passEncrypt) => {
                    if (err) return res.status(500).send({ message: `Error server: ${err}` })
                    user = {
                            password: passEncrypt
                        }
                        //update user password
                    User.findOneAndUpdate({ _id: rp._id_subject }, user, (err, userUpdate) => {
                        if (err) return res.status(500).send({ message: `Error server: ${err}` })
                            //update status finished to true
                        rp = {
                            finished: true
                        }
                        RestorePassword.findOneAndUpdate({ _id: restId }, rp, (err, rpUpdate) => {
                            if (err) return res.status(500).send({ message: `Error server: ${err}` })
                            mailer.passwordRestoredUser(userUpdate.email, password, userUpdate.userName)
                            return res.status(200).send(true)
                        })
                    })
                })

            } else { //if request has already been processed
                return res.status(200).send(false)
            }
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getUserByJwt,
    getUsers,
    getUsersByEmail,
    getUsersById,
    getUserById,
    getUserByUserName,
    getUserByEmail,
    deleteUser,
    updateUser,
    addDocFavorite,
    deleteDocFavorite,
    getDocFavUser,
    restorePassword,
    sendNewPassword
}