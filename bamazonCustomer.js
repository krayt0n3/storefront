var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "bexley10",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayProducts();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log('ID: ' + res[i].item_id + '\n'
       + 'Product Name: ' + res[i].product_name + '\n'
        + 'Department Name: ' + res[i].department_name + '\n'
         + 'Price: $' + res[i].price + '\n'
         + 'Stock Quantity: ' + res[i].stock_quantity + '\n' + '\n');
      
    }
    
    askCustomer();
  });
}

function askCustomer() {
  inquirer
  .prompt([ {
    type: 'checkbox',
    name: 'id',
    message: 'Input the ID of the product that you\'d like to buy.',
    choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'EXIT'] 
  },
  {
    type: 'number',
    name: 'quantity',
    message: 'Enter the quantity that you would like to buy.'
  }
  ])
  .then(answers => {
      connection.query("SELECT * FROM products", function(err, res) {
    
        if(answers.id === res[0].item_id){
          if(parseInt(res[0].stock_quantity) !== answers.quantity) {
            console.log('Insufficient quantity!');
            askCustomer();
          } else if (res[0].stock_quantity === answers.quantity) {
            var stock = res[0].stock_quantity - answers.quantity;
            console.log("Changing quantity...\n");
  var query = connection.query(
    "UPDATE products SET stock_quantity = " + stock + " WHERE stock_quantity = " + res[0].stock_quantity,
  
    function(err, res) {
      console.log(res.affectedRows + " quantity changed!\n");
      
    }) 
    console.log(query.sql);
    console.log(res[0].stock_quantity * res[0].price);
          }
      } else if(answers.id === 'EXIT') {
  connection.end();
}
 });
  });
}