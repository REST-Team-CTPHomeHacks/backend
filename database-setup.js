const promise = require('bluebird')

const options = {
    promiseLib: promise
}

const pgp = require('pg-promise')(options)
const connectionString = require('./connectionString.json')
const db = pgp(connectionString)

module.exports = {
    db
}