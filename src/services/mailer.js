"use strict";

var nodemailer = require('nodemailer');
const parameters = require("../../parameters");
const hbs = require("nodemailer-express-handlebars");

const defaultConfig = {
    service: "gmail",
    auth: {
        user: parameters.mailer.user,
        pass: parameters.mailer.password
    }
};

module.exports = {
    sendWelcomeEmail: (email, username) => {
        let transporter = nodemailer.createTransport(defaultConfig);
        let handlebarOptions = {
            viewEngine: {
                extName: ".hbs",
                partialsDir: "src/views/",
                layoutsDir: "src/views/",
                defaultLayout: "welcome.hbs"
            },
            viewPath: "src/views/",
            extName: ".hbs"
        };

        transporter.use("compile", hbs(handlebarOptions));

        let mailOptions = {
            from: parameters.mailer.user,
            to: email,
            subject: "welcome to Fuonle",
            template: "welcome",
            context: {
                username: username,
                email: email
            }
        };
        transporter
            .sendMail(mailOptions)
            .then(() => {
                console.log(`New welcome mail sent to ${email}`);
            })
            .catch(err => {
                console.error(err);
            });
    }
}