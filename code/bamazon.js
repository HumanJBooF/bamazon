const inquirer = require('inquirer');
const con = require('./connection.js');
const Table = require('cli-table-redemption');
const chalk = require('chalk');
const customer = require('./bamazonCustomer.js');
const manager = require('./bamazonManager.js');
const supervisor = require('./bamazonSupervisor.js');
const bold = chalk.green.bold; // chalk npm for colors
const table = new Table({ // cli-table-redemption for a nice table building the head her
    head: [bold('Id'), bold('Product Name'), bold('Department Name'), bold('Price'), bold('Quantity')],
    colWidths: [5, 40, 30, 15, 10], // width of each column
    colAligns: ['', '', '', 'right', 'right'], // right align price/quant
    style: { 'padding-top': 100 }
});

/* doing something a little bit different here
making a function that will call each page depending on who you are
*/
const options = () => {

    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: 'Who are you?',
            choices: ['Customer', 'Manager', 'Supervisor']
        }
    ]).then(answers => {
        switch (answers.choice) {
            case 'Customer':
                showAll(() => {
                    customer();
                });
                break;
            case 'Manager':
                manager();
                break;
            case 'Supervisor':
                supervisor();
                break;
            default:
                console.log(chalk`{bold.green Have a Great Day!}`);
                con.end();
                break;
        };
    });
};

// throw a callback in here so we can show the inventory then call the next function depending upon who it is
const showAll = cb => {

    con.query('SELECT * FROM products', (err, res) => { // Grab everything in the DB
        if (err) throw err;
        res.forEach(element => { // For each loop 
            // console.log(element.item_id, element.product_name, element.department_name, element.price, element.stock_quantity)
            let id = element.item_id;
            let name = element.product_name;
            let department = element.department_name;
            let price = element.price;
            let stock = element.stock_quantity;

            table.push([id, name, department, price, stock]); // filling the table with the data from bamazon DB
        });

        console.log(chalk`{yellow ${table.toString()}}`); // log table
        cb();
    });
}

options();


module.exports.showAll = showAll;
module.exports.options = options;