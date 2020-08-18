"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promise = require('bluebird'); // Promise library will be bluebird
// Set our promise library to the bluebird package above
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options); // Initialize pg-promise using our promise library
var connectionString = require('./connectionString.json'); // Load in the connection string we made
var db = pgp(connectionString); // Initialize our database with the connection string
// Export
// module.exports = {
//     db
// }
exports.default = db;
