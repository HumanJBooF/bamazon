const inquirer = require('inquirer');
const con = require('./connection.js');
const mysql = require('mysql');
const Table = require('cli-table-redemption');
const chalk = require('chalk');
const bamazon = require('./bamazon.js');

const managerDuties = () => {
    inquirer.prompt([
        {
            name: 'duties',
            type: 'list',
            message: '\r\nMr.Manager how may I help you?',
            choices: ['View All Inventory', 'View Low Inventory', 'Add to Inventory', 'And New Products']
        }
    ]).then(answers => {
        switch (answers.duties) {
            case 'View All Inventory':
                bamazon.showAll(() => {
                    reDo();
                })
                break;
            case 'View Low Inventory':
                viewLowInv();
                break;
            case 'Add to Inventory':
                bamazon.showAll(() => {
                    addToInv();
                })
                break;
            case 'And New Products':
                // code
                break;
            default:
                console.log(`There must be an error!`);
        }
    })
};

// const viewLowInv = () => {
//     con.query('SELECT product_name FROM products WHERE stock_quantity < 5', (err, res) => {
//         if (err) throw err;
//         res.forEach(element => {

//         });
//     })
// };

const addToInv = () => {
    inquirer.prompt([
        {
            name: 'Id',
            type: 'input',
            message: 'Enter the ID number of the product you want to add.'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to add?'
        }
    ]).then(answers => {

    });
};

const addNewProducts = () => {

};

const reDo = () => {
    inquirer.prompt([
        {
            name: 'answer',
            type: 'list',
            message: 'Would you like to do something else?',
            choices: ['Yes', 'No']
        }
    ]).then(answers => {
        switch (answers.answer) {
            case 'Yes':
                console.log('case 1');
                managerDuties();
                break;
            case 'No':
                console.log(chalk`{bold Have a great day!}`);
                con.end();
                break;
            default:
                con.end();
                break;
        }
    })
};

module.exports.managerDuties = managerDuties;