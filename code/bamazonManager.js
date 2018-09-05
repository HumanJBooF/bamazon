const inquirer = require('inquirer');
const con = require('./connection.js');
const mysql = require('mysql');
const Table = require('cli-table-redemption');
const chalk = require('chalk');
const show = require('./bamazonCustomer.js');

const managerDuties = () => {
    inquirer.prompt([
        {
            name: 'duties',
            type: 'list',
            message: '\r\nMr.Manager how may I help you?',
            choices: ['View Low Inventory', 'Add to Inventory', 'And New Products']
        }
    ]).then(answers => {
        switch (answers.duties) {
            case 'View Low Inventory':
                viewLowInv();
                break;
            case 'Add to Inventory':
                // code
                break;
            case 'And New Products':
                // code
                break;
            default:
                console.log(`There must be an error!`);
        }
    });
};

const viewLowInv = () => {
    con.query(`SELECT product_name FROM products WHERE stock_quantity` < 5, (err, res) => {
        console.log(res);
    })
};

const addToInv = () => {

};

const addNewProducts = () => {

};

module.exports.managerDuties = managerDuties;