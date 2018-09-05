const inquirer = require('inquirer');
const con = require('./connection.js');
const mysql = require('mysql');
const Table = require('cli-table-redemption');
const chalk = require('chalk');

const askQuestion = () => {

    inquirer.prompt([{
        type: 'input',
        name: 'item_id',
        message: 'What item ID would you like to buy?'
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many would you like to purchase?'
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

            if (amountWanted <= inStock) { // if the amount wanted is less than or equal to whats in stock
                let newTotal = inStock - amountWanted; // subtract amount wanted from whats in stock
                price *= amountWanted; // times it by the price
                // console.log(item, price);
                console.log(chalk`{bold.green \r\nYou just bought: ${amountWanted} ${item}'s for the price of ${price}}`); // log what they bought and how much
                updateStore(newTotal, id); // send the new stock number and the id of the product to update store func
            } else {
                console.log(chalk`{red Insufficient funds!}`); // if not enough are in stock 
            };
        });
    });
};

const updateStore = (newTotal, id) => { // update the store with the new stock quantity 
    con.query(`UPDATE products SET stock_quantity = ? WHERE ?`, [[newTotal], { item_id: id }], (err, res) => {
        if (err) throw err;
        shopAgain(newTotal)
    })
};

const shopAgain = newTotal => {
    inquirer.prompt([
        {
            name: 'add',
            type: 'list',
            message: 'Do you want to purchase another item?',
            choices: ['Yes', 'No']
        }
    ]).then(answers => {
        switch (answers.add) {
            case 'Yes':
                let log = [
                    chalk`{green ~~~~~~~~~~~~~~~~~~~~~~~~~~~~}`,
                    chalk`\t{bold.green Amount left:${newTotal}}`,
                    chalk`{green ~~~~~~~~~~~~~~~~~~~~~~~~~~~~}`
                ].join('\r\n');
                console.log(log);
                askQuestion();
                break;
            case 'No':
                console.log(chalk`{bold Have a great day!}`);
                con.end(); // end connection
                break;
            default:
                console.log(chalk`{bold Goodbye! }`);
                break;
        }
    });
};


module.exports.askQuestion = askQuestion;