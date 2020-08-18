const express = require('express')
const app = express()
const db = require('./database-setup')
const bodyParser = require('body-parser')

function isValidDate(date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
        if (isNaN(date.getTime())) {
            return false
        }
        else {
            return true
        }
    }
    else {
        return false
    }
}

app.use(express.urlencoded())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: 'Use /activities/:date to get a list of activities on that week'
    })
})

app.get('/activities/:date', (req, res) => {
    let date = new Date(req.params.date)

    if (isValidDate(date)) {
        let start_of_week = new Date()
        start_of_week.setDate(date.getDate() - date.getDay())

        let end_of_week = new Date()

        end_of_week.setDate(start_of_week.getDate() + 6)

        db.db.any("SELECT date, json_agg(activities) activities FROM activities WHERE date <= ${higherDate} AND date >= ${lowerDate} GROUP BY date", {
            higherDate: end_of_week,
            lowerDate: start_of_week
        })
        .then(data => {
            res.status(200)
            .json({
                data
            })
        })
        .catch(err => {
            res.status(500)
            .json({
                err
            })
        })
    }
    else {
        res.status(500)
            .json({
            message: "Please enter a valid date!"
        })
    }
})

app.post('/push_activity', (req, res) => {
    let activity_object = {}
    let validActivity = true

    if (req.body.date) 
        activity_object.date = req.body.date
    else
        validActivity = false

    if (req.body.activity_name)
        activity_object.activity_name = req.body.activity_name
    else
        validActivity = false

    if (req.body.description)
        activity_object.description = req.body.description
    else
        activity_object.description = null

    if (req.body.time_start && req.body.time_end) {
        activity_object.time_start = req.body.time_start
        activity_object.time_end = req.body.time_end
    }
    else
        validActivity = false

    if (typeof req.body.work === 'boolean')
        activity_object.work = req.body.work
    else
        validActivity = false

    db.db.none("INSERT INTO activities (date, activity_name, description, time_start, time_end, is_work) VALUES (${date}, ${activity_name}, ${description}, ${time_start}, ${time_end}, ${work})", activity_object)
    .then(() => {
        res.status(200)
        .json({
            message: "Activity successfully inserted!"
        })
    })
    .catch(err => {
        res.status(500)
        .json({
            err
        })
    })
})

app.listen(1337, () => {
    console.log('testing')
})