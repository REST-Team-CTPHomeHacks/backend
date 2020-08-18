import promise from 'bluebird'  // Promise library will be bluebird

// Set our promise library to the bluebird package above
const options = {
    promiseLib: promise
}

const pgp = require('pg-promise')(options)    // Initialize pg-promise using our promise library
const connectionString = require('../connectionString.json')    // Load in the connection string we made
const db = pgp(connectionString)    // Initialize our database with the connection string

// Export
// module.exports = {
//     db
// }

export default db;
