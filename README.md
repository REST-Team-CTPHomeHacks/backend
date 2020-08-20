# The backend to our CTPHomeHacks Hackathon submission

## Setup

Clone the repository

Run `npm install`

Run `npm install typescript -g`

Run `npm install tsc-watch -g`

Install postgresql, and create a database. Run this script to generate the table

```sql
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    activity_name VARCHAR(30) NOT NULL,
    description VARCHAR(255) NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    is_work BOOL NOT NULL
);
```

In the root directory, make a connectionString.json file, fill it with these contents

```json
{
  "host": "localhost",
  "port": 5432,
  "database": "your-database-name"
  "user": "postgres",
  "password": "your-password-to-postgre"
}
```

This is your connection string to the database

After that, while in the root directory, run `tsc -w`. In another terminal run `node src/app.js` to run the server
