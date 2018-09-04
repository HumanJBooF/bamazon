require('dotenv').config()
const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table-redemption');
const chalk = require('chalk');

// give the info need to connect
const con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASS, // put password in .env file for good pratice
    database: 'bamazon'
});

// make the connection to bamazon db
con.connect(err => {
    if (err) throw err;
    console.log(`Connected as: ${con.threadId}`); // log the id
    showAll(); // call the showAll function
});

const showAll = () => {
    let bold = chalk.green.bold; // chalk npm for colors
    const table = new Table({ // cli-table-redemption for a nice table building the head her
        head: [bold('Id'), bold('Product Name'), bold('Department Name'), bold('Price'), bold('Quantity')],
        colWidths: [5, 40, 30, 15, 10], // width of each column
        colAligns: ['', '', '', 'right', 'right'] // right align price/quant
    });
    con.query('SELECT * FROM products', (err, res) => { // Grab everything in the DB
        if (err) throw err;
        res.forEach(element => { // For each loop 
            // console.log(element.item_id, element.product_name, element.department_name, element.price, element.stock_quantity)
            let id = element.item_id;
            let name = element.product_name;
            let department = element.department_name;
            let price = element.price;
            let stock = element.stock_quantity;

            table.push(
                [id, name, department, price, stock] // filling the table with the data from bamazon DB
            );
        });
        console.log(chalk.yellow(table.toString())); // log table
        askQuestion(); // Start inquirer
    });
};

const askQuestion = () => {

    inquirer.prompt([{
        type: 'input',
        name: 'item_id',
        message: 'What item ID would you like to buy?',
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many would you like to purchase?'
    }]).then(answers => {
        let id = answers.item_id; // making this a little smaller
        con.query(`SELECT * FROM products WHERE item_id=${id}`, (err, res) => { // look for the ID number
            if (err) throw err;
            // console.log(res)

            let amountWanted = answers.quantity; // Put how many the user wants into a variable
            let inStock = res[0].stock_quantity; // how many is in stock currently
            let item = res[0].product_name; // name of the item the user wants
            let price = res[0].price; // price of that item

            if (amountWanted <= inStock) { // if the amount wanted is less than or equal to whats in stock
                let newTotal = inStock - amountWanted; // subtract amount wanted from whats in stock
                price = price * amountWanted; // times it by the price
                // console.log(item, price);
                console.log(chalk`{bold.green You just bought ${item} for the price of ${price}}`); // log what they bought and how much
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
        let log = [
            chalk`{green ~~~~~~~~~~~~~~~~~~~~~~~~~~~~}`,
            chalk`\t{bold.green Amount left:${newTotal}}`,
            chalk`{green ~~~~~~~~~~~~~~~~~~~~~~~~~~~~}`
        ].join('\r\n');
        console.log(log);
        con.end(); // end connection
    })
};
