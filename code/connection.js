require('dotenv').config()
const mysql = require('mysql');

// give the info need to connect
const con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASS, // put password in .env file for good pratice
    database: 'bamazon'
});

// make the connection to bamazon db
con.connect(err => {
    if (err) throw err;
    console.log(`Connected as: ${con.threadId}`); // log the id
});

module.exports = con;