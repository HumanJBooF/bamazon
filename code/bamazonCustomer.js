const inquirer = require('inquirer');
const mysql = require('mysql');
const cli = require('cli-table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // may put password in another file so for now leaving it out
    database: 'bamazon'
});

// connection.connect(err => {
//     if (err) throw err;

// });

