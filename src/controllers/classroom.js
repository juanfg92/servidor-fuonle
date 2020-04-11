'use strict'

const Classroom = require('../models/classroom')

async function newClassroom(req, res) {
    // Check empty camps
    if (req.body._id_user == null ||
        req.body._id_user == "" ||
        req.body.classroomName == null ||
        req.body.classroomName == "" ||
        req.body.password == null ||
        req.body.password == "") {
        return res.status(500).send({ message: `Error creating the class room: empty camps` })
    }

    // userName validation 
    if (!(/^[A-Za-z][A-Za-z0-9 ]{2,19}$/.test(req.body.userName))) return res.status(400).send({ message: `the class room name must be between 2 and 20 characters, not contain spaces and empy start with a letter` });

    // Password validation between 4 and 10 characters
    if (req.body.password.length < 4 || req.body.password.length > 10) return res.status(400).send({
        message: `the password must be between 4 and 10 characters`
    });


    /**
     * me quedo aqui, controlar que no se repitan el nombre de las classroom
     */

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