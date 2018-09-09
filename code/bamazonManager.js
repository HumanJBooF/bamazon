const inquirer = require('inquirer');
const con = require('./connection.js');
const Table = require('cli-table-redemption');
const chalk = require('chalk');
const bamazon = require('./bamazon.js');
const bold = chalk.green.bold; // chalk npm for colors
const table = new Table({ // cli-table-redemption for a nice table building the head her
    head: [bold('Id'), bold('Product Name'), bold('Department Name'), bold('Price'), bold('Quantity')],
    colWidths: [5, 40, 30, 15, 10], // width of each column
    colAligns: ['', '', '', 'right', 'right'], // right align price/quant
});

// Start the inquire prompt to ask the manager what they wanna do
const managerDuties = () => {
    inquirer.prompt([
        {
            name: 'duties',
            type: 'list',
            message: '\r\nMr.Manager how may I help you?',
            choices: ['View All Inventory', 'View Low Inventory', 'Add to Inventory', 'Add New Products', 'Go back to options', 'Leave']
        }
    ]).then(answers => { // depending on their answer 
        switch (answers.duties) {
            case 'View All Inventory':
                bamazon.showAll(() => {
                    reDo();
                });
                break;
            case 'View Low Inventory':
                viewLowInv();
                break;
            case 'Add to Inventory':
                bamazon.showAll(() => {
                    addToInv();
                });
                break;
            case 'Add New Products':
                addNewProducts();
                break;
            case 'Go back to options':
                bamazon.options();
                break;
            case 'Leave':
                console.log(bold('\r\n\t\tGoodbye!\r\n'));
                con.end();
                break;
            default:
                console.log(chalk`{red.bold There must be an error!}`);
                con.end();
                break;
        }
    })
};

const viewLowInv = () => {
    con.query('SELECT * FROM products WHERE stock_quantity <= 5', (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            let id = element.item_id;
            let name = element.product_name;
            let department = element.department_name;
            let price = element.price;
            let stock = element.stock_quantity;

            table.push([id, name, department, price, stock]);
        });
        switch (res.length === 0) {
            case true:
                let log = [
                    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
                    `\t\tFully Stocked!`,
                    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
                ].join(`\r\n`);
                console.log(bold(log))
                reDo();
                break;
            case false:
                console.log(chalk`{red ${table.toString()}\r\n}`);
                console.log(chalk`{red.bold \t Looks like its time to restock\r\n}`);
                reDo();
                break;
        }
    })
};

const addToInv = () => {
    con.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;
        let dbLength = res.length
        inquirer.prompt([
            {
                name: 'Id',
                type: 'input',
                message: 'Enter the ID number of the product you want to add inventory to.',
                validate: (value) => {
                    return (value > dbLength) ? console.log(chalk`{green.bold \r\n We don't have a product with ID: #${value} Please try again} \r\n`) : true;
                }
            },
            {
                name: 'quantity',
                type: 'input',
                message: 'How many would you like to add?',
                validate: (value) => {
                    return value.match(/^[0-9]+$/) ? true : console.log(chalk`{bold.red \r\n\tPLEASE ENTER A NUMBER}`);
                }
            }
        ]).then(answers => {
            let id = answers.Id;
            let quantity = answers.quantity;

            con.query(`UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?`, [quantity, id], (err, res) => {
                if (err) throw err;
                console.log(chalk`{bold \r\n You updated your inventory!}`);
                con.query(`SELECT * FROM products WHERE item_id = ?`, [id], (err, res) => {
                    if (err) throw err;
                    id = res[0].item_id;
                    let name = res[0].product_name;
                    let department = res[0].department_name;
                    let price = res[0].price;
                    let stock = res[0].stock_quantity;

                    table.push([id, name, department, price, stock]);
                    console.log(chalk`{yellow ${table.toString()}}`);
                    reDo();
                });
            });
        }).catch(err => {
            if (err) throw err;
        });
    });
};

const addNewProducts = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the product.'
        },
        {
            name: 'department',
            type: 'input',
            message: 'What department does the product belong in?'
        },
        {
            name: 'price',
            type: 'input',
            message: 'What is the price of the product? (ex: 1200.00)f',
            validate: (value) => {
                return value.match(/^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/) ? true : console.log(chalk`{bold.green PLEASE ENTER A NUMBER WITH THE FORMAT OF 1111.00!}`);
            }
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to add?',
            validate: (value) => {
                return value.match(/^[0-9]+$/) ? true : console.log(chalk`{bold.red \r\n\tPLEASE ENTER A NUMBER}`);
            }
        }
    ]).then(answers => {
        con.query(`INSERT INTO products SET ?`,
            {
                product_name: answers.name,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.quantity
            }, (err, res) => {
                if (err) throw err;
                let name = answers.name;
                let department = answers.department;
                let stock = answers.quantity;
                let price = (answers.price).toFixed(2);
                console.log(chalk.bold(`You added ${stock} ${name}'s to ${department} department at a price of $${price}`));
                reDo();
            });
    }).catch(err => {
        if (err) throw err;
    });;
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
                // console.log('case 1');
                managerDuties();
                break;
            case 'No':
                console.log(chalk.bold('Have a great day!'));
                con.end();
                break;
            default:
                con.end();
                break;
        }
    }).catch(err => {
        if (err) throw err;
    });
};

module.exports = managerDuties;