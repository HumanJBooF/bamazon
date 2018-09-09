const con = require('./connection.js');
const inquirer = require('inquirer');
const Table = require('cli-table-redemption');
const chalk = require('chalk');
const bamazon = require('./bamazon.js');

const askWhatToDo = () => {
    inquirer.prompt([
        {
            name: 'super',
            type: 'list',
            message: '\r\n Hello Mr.Supervisor, Great to see you! \r\n What would you like to do?',
            choices: ['View Product Sales By Department', 'Create New Department', 'Go back to options', 'Leave']
        }
    ]).then(answers => {
        switch (answers.super) {
            case 'View Product Sales By Department':
                viewByDepartment();
                break;
            case 'Create New Department':
                createNewDepartment();
                break;
            case 'Go back to options':
                bamazon.options();
                break;
            case 'Leave':
                console.log(chalk`{bold.green Come back soon sir!}`);
                con.end();
                break;
            default:
                console.log(chalk`{bold.green Come back soon sir!}`);
                con.end();
                break;
        };
    });
};

const viewByDepartment = () => {

};

const createNewDepartment = () => {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What department would you like to add?'
        },
        {
            name: 'overhead',
            type: 'input',
            message: 'What is the overhead cost?',
            validate: (value) => {
                return value.match(/^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/) ? true : console.log(chalk`{bold.green PLEASE ENTER A NUMBER WITH THE FORMAT OF 1111.00!}`);

            }
        }
    ]).then(answers => {
        con.query(`INSERT INTO departments SET ?`, {
            department_name: answers.department,
            overhead_cost: answers.overhead
        }, (err, res) => {
            if (err) throw err;
            console.log(chalk`{bold.green Department Added!}`);
            askAgain();
        })
    })
};

const askAgain = () => {
    inquirer.prompt([
        {
            name: 'again',
            type: 'list',
            message: 'Would you like to do something else?',
            choices: ['Yes', 'No', 'Change to Customer/Manager']
        }
    ]).then(answers => {
        switch (answers.again) {
            case 'Yes':
                askWhatToDo();
                break;
            case 'No':
                console.log(chalk`{bold.green Have a great day sir!}`);
                con.end();
                break;
            case 'Change to Customer/Manager':
                bamazon.options();
                break;
            default:
                console.log(chalk`{bold.green Have a great day sir!}`);
                con.end();
                break;
        }
    })
}
module.exports = askWhatToDo;