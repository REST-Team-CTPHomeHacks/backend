import Express from 'express';  // Express for handling RESTful API routes
import db from './database-setup';  // Include our database-setup for making database queries

const app = Express()    // Initialize "app" as Express

// Checks if a date is a valid date
function isValidDate(date: Date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
        return isNaN(date.getTime())
    } else {
        return false
    }
}

// Allows body parsing for post requests
app.use(Express.urlencoded())
app.use(Express.json())

// Initial endpoint
app.get('/', (req: Express.Request, res: Express.Response) => {
    res.json({
        message: 'Use /activities/:date to get a list of activities on that week'
    })
})

// Function to recieve all activities per day for the given week.
app.get('/activities/:date', (req: Express.Request, res: Express.Response) => {
    let date = new Date(req.params.date)  // Creates a date object from a given date

    // If we send in a valid date, move on
    if (isValidDate(date)) {
        // Initializes start and end of week as blank date objects
        let start_of_week = new Date()
        let end_of_week = new Date()

        // Makes the start of the week the sunday just before the date given
        start_of_week.setDate(date.getDate() - date.getDay())

        end_of_week.setDate(start_of_week.getDate() + 6)    // Makes the end of the week the saturday after the date given

        // Queries the database for all activities made between the start and end of the week
        db.db.any("SELECT date, json_agg(activities) activities FROM activities WHERE date <= ${higherDate} AND date >= ${lowerDate} GROUP BY date", {
            higherDate: end_of_week,
            lowerDate: start_of_week
        })
        .then((data) => {
            res.status(200)
            .json({
                data
            })
        })
        .catch((err) => {
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

type Activity = Partial<{
    date;
    name;
    description;
    time_start;
    time_end;
    work;
}>;

// Allows a user to send and create a new activty
app.post('/push_activity', ({ body: { date, description, name, time_end, time_start, work } }, res) => {
    // An activity object that will store all the necessary information regarding our activity that we'd like to send to
    // the database.

    let activity_object: Activity = {
        date: date || null,
        name: name || null,
        description: description || null,
        time_start: time_start || null,
        time_end: time_end || null,
        work: work || null,
    };
    // let validActivity = true    // Is set to false if our current activity is not valid

    // A bunch of checks based on the post body. These should all eventually get pushed into activity_object
    // if (req.body.date)
    //     activity_object.date = req.body.date
    // if (req.body.activity_name)
    //     activity_object.name = req.body.activity_name
    // if (req.body.description)
    //     activity_object.description = req.body.description
    // else
    //     activity_object.description = null
    // if (req.body.time_start && req.body.time_end) {
    //     activity_object.time_start = req.body.time_start
    //     activity_object.time_end = req.body.time_end
    // }
    // if (typeof req.body.work === 'boolean')
    //     activity_object.work = req.body.work

    // Insert our activity_object into the database
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

// Run the server
app.listen(1337, () => {
    console.log('testing')
})