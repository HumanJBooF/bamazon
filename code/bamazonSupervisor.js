const con = require('./connection.js');
const inquirer = require('inquirer');
const Table = require('cli-table-redemption');
const chalk = require('chalk');


const askWhatToDo = () => {
    inquirer.prompt([
        {
            name: 'super',
            type: 'list',
            message: '\r\n Hello Mr.Supervisor, Great to see you! \r\n What would you like to do?',
            choices: ['View Product Sales By Department', 'Create New Department', 'Leave']
        }
    ]).then(answers => {
        switch (answers.super) {
            case 'View Product Sales By Department':
                console.log(`case 1 bro`);
                break;
            case 'Create New Department':
                console.log(`case 2 brah`);
                break;
            case 'Leave':
                console.log(chalk`{bold.green Come back soon sir!}`);
                con.end();
                break;
            default:
                console.log(chalk`{bold.green Come back soon sir!}`);
                con.end();
                break;
        }
    })
}

module.exports = askWhatToDo;