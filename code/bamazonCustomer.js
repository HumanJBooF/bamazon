const inquirer = require('inquirer');
const con = require('./connection.js');
const chalk = require('chalk');
const bamazon = require('./bamazon.js');

const askQuestion = () => {
    con.query(`SELECT * FROM products`, (err, res) => { //querying first so we can get the length of our DB to match the input
        if (err) throw err;
        let dbLength = res.length
        // console.log(dbLength);
        inquirer.prompt([{
            name: 'item_id',
            type: 'input',
            message: 'What item ID would you like to buy?',
            validate: (value) => {
                return (value > dbLength) ? console.log(chalk`{green.bold \r\n We don't have a product with ID: #${value} Please try again} \r\n`) : true;
            }
        }, {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to purchase?',
            validate: (value) => {
                return value.match(/^[0-9]+$/) ? true : console.log(chalk`{bold.red \r\n\t\tENTER A NUMBER PLEASE!}`);
            }
        }]).then(answers => {
            let id = answers.item_id; // making this a little smaller
            // look for the ID number
            con.query(`SELECT * FROM products WHERE item_id=${id}`, (err, res) => {
                if (err) throw err;
                // console.log(res)

                let amountWanted = answers.quantity; // Put how many the user wants into a variable
                let inStock = res[0].stock_quantity; // how many is in stock currently
                let item = res[0].product_name; // name of the item the user wants
                let price = res[0].price; // price of that item
                let sales = parseInt(res[0].product_sales);

                switch (amountWanted <= inStock) {
                    case true:
                        let newTotal = inStock - amountWanted; // subtract amount wanted from whats in stock
                        price = parseInt(price * amountWanted); // times it by the price
                        let newSales = (sales + price).toFixed(2);
                        console.log(chalk`{bold.green \r\nYou just bought: ${amountWanted} ${item}'s for the price of $${price.toFixed(2)}}`); // log what they bought and how much
                        let log = [
                            chalk`{green \t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~}`,
                            chalk`\t\t\t\t{bold.green Amount left:${newTotal}}`,
                            chalk`{green \t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~}`
                        ].join('\r\n');
                        console.log(log);
                        updateStore(newTotal, id, newSales); // send the new stock number, the id of the product and the new sales number to update store func
                        break;
                    case false:
                        console.log(chalk`{red We don't have that many!}`); // if not enough are in stock 
                        shopAgain();
                }
            });
        }).catch(err => {
            if (err) throw err;
        });
    });
};

const updateStore = (newTotal, id, newSales) => { // update the store with the new stock quantity 
    con.query(`UPDATE products SET ? WHERE ?`, [
        {
            stock_quantity: newTotal,
            product_sales: newSales
        },
        {
            item_id: id
        }], (err, res) => {
            if (err) throw err;
            shopAgain();
        });
};

const shopAgain = () => {
    inquirer.prompt([
        {
            name: 'again',
            type: 'list',
            message: 'Do you want to purchase another item?',
            choices: ['Yes', 'No', 'Change to manager/supervisor']
        }
    ]).then(answers => {
        switch (answers.again) {
            case 'Yes':
                askQuestion();
                break;
            case 'No':
                console.log(chalk`{bold Have a great day!}`);
                con.end(); // end connection
                break;
            case 'Change to manager/supervisor':
                bamazon.options();
                break;
            default:
                console.log(chalk`{bold Goodbye! }`);
                con.end();
                break;
        }
    }).catch(err => {
        if (err) throw err;
    });
};


module.exports = askQuestion;