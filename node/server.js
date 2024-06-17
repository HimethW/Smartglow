const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');

//new line
// Create an instance of express
const app = express();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());


// Function to generate a random string of given length
function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Trim to desired length
}


// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',     // Replace with your MySQL server host
  user: 'himethvs',  // Replace with your MySQL username
  password: 'RooTsql#$%321',  // Replace with your MySQL password
  database: 'test'   // Replace with your MySQL database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Define a POST route to handle incoming JSON data
app.post('/save', (req, res) => {
  const { username, password, email } = req.body;

  // Validate the input data
  if (!username || !password || !email) {
    return res.status(400).send('Missing required fields');
  }

  // Insert the data into the database
  const sql = 'INSERT INTO user (username, password, email) VALUES (?, ?, ?)';
  db.query(sql, [username, password, email], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err.stack);
      return res.status(500).send('Error inserting data into the database');
    };
    //res.status(200).send('Data saved successfully');

});

// Generate a random 50-character string
const randomString = generateRandomString(50)


// SQL query to select the maximum id from the user table
const sqlQuery = 'SELECT MAX(id) AS maxId FROM user';

// Execute the SQL query
db.query(sqlQuery, (error, results, fields) => {
if (error) {
    console.error('Error executing SQL query:', error.stack);
return;
}
// Extract the maximum id from the query results
const maxId = results[0].maxId;

const sql2 = 'INSERT INTO app (id, topic, bulbs) VALUES (?, ?, ?)'

db.query(sql2, [maxId, randomString, '[0]'], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err.stack);
      return res.status(500).send('Error inserting data into app table');
    };
    res.status(200).send(randomString);
});

});






});

//edited
app.post('/bulbs', (req, res) => {

  const { bulbs_list , topic} = req.body;
  // Validate the input data
  if (!bulbs_list || !topic) {
    return res.status(400).send('Missing bulbs');
  }
  const sql3 = 'UPDATE app SET bulbs = ? WHERE topic = ?';
  db.query(sql3, [bulbs_list,topic], (err, result) => {
    if (err) {
      console.error('Error inserting bulbs into the database:', err.stack);
      return res.status(500).send('Error inserting data into the database');
    };
    res.status(200).send('Bulbs saved successfully');

});
});

//edited 2

app.post('/login', (req, res) => {

  const { username , password} = req.body;
  // Validate the input data
  if (!username || !password) {
    return res.status(400).send('Missing bulbs');
  }

  const sql4 = 'SELECT password,id FROM user WHERE username = ?';
  db.query(sql4, [username], (err, result) => {
  if (err) {
    console.error('Error querying the database:', err.stack);
    return res.status(500).send('Error querying the database');
  }

  if (result.length === 0) {
    return res.status(401).send('Invalid username or password');
  }

  const storedHashedPassword = result[0].password;
  const userid = result[0].id

  // Compare the hashed password sent from the client with the stored hashed password
  if (password === storedHashedPassword) {

    const sql5 = 'SELECT topic,bulbs FROM app WHERE id = ?';
    db.query(sql5, [userid], (err, result) => {
    if (err) {
      console.error('Error getting bulbs', err.stack);
      return res.status(500).send('Error querying the database');
    }
    res.status(200).send(result);
  })

  } else {
    res.status(401).send('Invalid');
  }
});
  
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
