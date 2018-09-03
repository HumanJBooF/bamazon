require('dotenv').config
const inquirer = require('inquirer');
const mysql = require('mysql');
const cli = require('cli-table');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASS,
    database: 'bamazon'
});

connection.connect(err => {
    if (err) throw err;
    connection.end();
});

