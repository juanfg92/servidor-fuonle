'use strict'


const mongoose = require("mongoose");
const config = require("./config");
const app = require("./app");



mongoose.connect(
    config.db, { useCreateIndex: true, useNewUrlParser: true },
    (err, res) => {
        if (err) {
            return console.log(`Failed to connect to database: ${err}`);
        }
        console.log("Connection to the established database.");

        app.listen(config.port, () => {
            console.log(`Server running on port:${config.port}`);
        });
    }
);