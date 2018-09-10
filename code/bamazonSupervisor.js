const con = require('./connection.js');
const inquirer = require('inquirer');
const Table = require('cli-table-redemption');
const chalk = require('chalk');
const bamazon = require('./bamazon.js');
const bold = chalk.green.bold; // chalk npm for colors
const table = new Table({ // cli-table-redemption for a nice table building the head her
    head: [bold('Id'), bold('Department Name'), bold('Overhead Cost'), bold('Product Sales'), bold('Total Profits')],
    colWidths: [5, 40, 30, 20, 20], // width of each column
    colAligns: ['', '', '', 'right', 'right'], // right align price/quant
});

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
                viewByDepartment();
                break;
            case 'Create New Department':
                createNewDepartment();
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
    }).catch(err => {
        if (err) throw err;
    });
};

// This took me the most time, I could not find a solid way to do this 
// but after a long time of searching and throwing things together this is what we got, it works
const viewByDepartment = () => {
    // putting it into a query variable because of the length
    let query = `SELECT departments.department_id, departments.department_name, departments.overhead_cost, CASE WHEN SUM(products.product_sales) IS NULL THEN 0 ELSE SUM(products.product_sales) END AS product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id, departments.department_name;`;
    con.query(query,
        (err, res) => {
            if (err) throw err;
            // loop the response and grab each column 
            res.forEach(element => {
                let id = element.department_id;
                let name = element.department_name;
                let overhead = parseInt(element.overhead_cost).toFixed(2); // integers and making sure there is 2 decimal places
                let productSales = parseInt(element.product_sales).toFixed(2);// same here
                let total = (productSales - overhead).toFixed(2);
                overhead = '$' + overhead; // making sure these will all have $ in front in the table
                productSales = '$' + productSales;
                total = '$' + total;

                table.push([id, name, overhead, productSales, total]);
            })
            console.log(chalk`{yellow ${table.toString()}}`)
            askAgain();
        })
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
    }).catch(err => {
        if (err) throw err;
    });
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
    }).catch(err => {
        if (err) throw err;
    });
}

module.exports = askWhatToDo;