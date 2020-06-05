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
    },
    sendResetPasswordUser: (email, idRestore, username) => {
        let transporter = nodemailer.createTransport(defaultConfig);
        let handlebarOptions = {
            viewEngine: {
                extName: ".hbs",
                partialsDir: "src/views/",
                layoutsDir: "src/views/",
                defaultLayout: "resetPasswordUser.hbs"
            },
            viewPath: "src/views/",
            extName: ".hbs"
        };

        transporter.use("compile", hbs(handlebarOptions));

        let mailOptions = {
            from: parameters.mailer.user,
            to: email,
            subject: "Reset password",
            template: "resetPasswordUser",
            context: {
                id: idRestore,
                email: email,
                username: username
            }
        };
        transporter
            .sendMail(mailOptions)
            .then(() => {
                console.log(`New reset password mail sent to ${email}`);
            })
            .catch(err => {
                console.error(err);
            });
    },
    passwordRestoredUser: (email, password, username) => {
        let transporter = nodemailer.createTransport(defaultConfig);
        let handlebarOptions = {
            viewEngine: {
                extName: ".hbs",
                partialsDir: "src/views/",
                layoutsDir: "src/views/",
                defaultLayout: "passwordRestoredUser.hbs"
            },
            viewPath: "src/views/",
            extName: ".hbs"
        };

        transporter.use("compile", hbs(handlebarOptions));

        let mailOptions = {
            from: parameters.mailer.user,
            to: email,
            subject: "Password Restored",
            template: "passwordRestoredUser",
            context: {
                email: email,
                password: password,
                username: username
            }
        };
        transporter
            .sendMail(mailOptions)
            .then(() => {
                console.log(`Password restore mail sent to ${email}`);
            })
            .catch(err => {
                console.error(err);
            });
    }
}